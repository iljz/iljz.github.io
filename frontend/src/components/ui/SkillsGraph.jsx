import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

const DEFAULT_GRAPH_WIDTH = 960;
const CATEGORY_COLORS = {
  Languages: '#8ecae6',
  'ML/AI': '#ffb703',
  'Web & Backend': '#90be6d',
  'Tools & Infrastructure': '#f28482',
};
const CATEGORY_DESCRIPTIONS = {
  Languages: 'Core languages I use to build, prototype, and analyze systems.',
  'ML/AI': 'Modeling, retrieval, and experimentation tools I rely on for research and applied AI.',
  'Web & Backend': 'Frameworks and data systems I use to ship full-stack products.',
  'Tools & Infrastructure': 'Operational tools that help me deploy, collaborate, and scale work.',
};
const PIN_COLOR = '#facc15';

function buildSkillGraphData(allSkills, featuredProjects) {
  const nodes = new Map();
  const links = new Map();

  const addLink = (source, target, reason) => {
    if (source === target || !nodes.has(source) || !nodes.has(target)) return;
    const [from, to] = [source, target].sort((a, b) => a.localeCompare(b));
    const key = `${from}__${to}`;
    const current = links.get(key) ?? { source: from, target: to, reasons: new Set(), weight: 0 };
    current.reasons.add(reason);
    current.weight += reason === 'project' ? 2 : 1;
    links.set(key, current);
  };

  Object.entries(allSkills).forEach(([category, items]) => {
    items.forEach((name) =>
      nodes.set(name, { id: name, category, neighbors: new Set(), projects: new Set() })
    );
    items.forEach((src, i) =>
      items.slice(i + 1).forEach((tgt) => addLink(src, tgt, 'category'))
    );
  });

  featuredProjects.forEach((project) => {
    const matched = project.tech.filter((t) => nodes.has(t));
    matched.forEach((name) => nodes.get(name).projects.add(project.title));
    matched.forEach((src, i) =>
      matched.slice(i + 1).forEach((tgt) => addLink(src, tgt, 'project'))
    );
  });

  links.forEach((link) => {
    nodes.get(link.source).neighbors.add(link.target);
    nodes.get(link.target).neighbors.add(link.source);
  });

  const graphNodes = Array.from(nodes.values()).map((n) => ({
    ...n,
    degree: n.neighbors.size,
    neighbors: Array.from(n.neighbors).sort(),
    projectCount: n.projects.size,
    projects: Array.from(n.projects).sort(),
  }));

  const graphLinks = Array.from(links.values()).map((l) => ({
    source: l.source,
    target: l.target,
    weight: l.weight,
    hasCategoryLink: l.reasons.has('category'),
    hasProjectLink: l.reasons.has('project'),
  }));

  const topSkill = [...graphNodes].sort((a, b) =>
    b.projectCount !== a.projectCount ? b.projectCount - a.projectCount : b.degree - a.degree
  )[0];

  return {
    nodes: graphNodes,
    links: graphLinks,
    categories: Object.keys(allSkills),
    topSkillId: topSkill?.id ?? null,
  };
}

const StatCard = ({ label, value, description }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-xs uppercase tracking-[0.24em] text-silver">{label}</p>
    <p className="mt-2 text-3xl font-display text-ivory">{value}</p>
    <p className="mt-2 text-sm text-silver">{description}</p>
  </div>
);

const SkillsGraph = ({ skills, projects }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const highlightRef = useRef(null);

  const [graphWidth, setGraphWidth] = useState(0);
  const [hoveredSkillId, setHoveredSkillId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const data = useMemo(() => buildSkillGraphData(skills, projects), [projects, skills]);
  const [selectedSkillId, setSelectedSkillId] = useState(data.topSkillId);

  useEffect(() => {
    if (!data.nodes.some((n) => n.id === selectedSkillId)) {
      setSelectedSkillId(data.topSkillId);
    }
  }, [data.nodes, data.topSkillId, selectedSkillId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const measure = () =>
      setGraphWidth(el.getBoundingClientRect().width || el.clientWidth || DEFAULT_GRAPH_WIDTH);
    measure();
    const observer = new ResizeObserver(([entry]) =>
      setGraphWidth(entry.contentRect.width || DEFAULT_GRAPH_WIDTH)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resolvedWidth = graphWidth || DEFAULT_GRAPH_WIDTH;
  const height = Math.max(440, Math.min(620, resolvedWidth * 0.7));

  const activeSkillId = hoveredSkillId ?? selectedSkillId ?? data.topSkillId;
  const activeSkill =
    data.nodes.find((n) => n.id === activeSkillId) ??
    data.nodes.find((n) => n.id === data.topSkillId) ??
    null;
  const projectLinkedCount = data.nodes.filter((n) => n.projectCount > 0).length;

  // --- Main D3 simulation effect (runs only on data/size change) ---
  useEffect(() => {
    if (!svgRef.current || !resolvedWidth) return undefined;

    const width = resolvedWidth;
    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = data.links.map((l) => ({ ...l }));
    const maxConn = d3.max(nodes, (n) => n.degree + n.projectCount) ?? 1;
    const radiusScale = d3.scaleSqrt().domain([0, maxConn]).range([14, 26]);
    const categoryX = new Map(
      data.categories.map((cat, i) => [cat, ((i + 1) * width) / (data.categories.length + 1)])
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((n) => n.id)
          .distance((l) => (l.hasProjectLink ? 80 : 110))
          .strength((l) => (l.hasProjectLink ? 0.55 : 0.18))
      )
      .force('charge', d3.forceManyBody().strength(-220))
      .force(
        'collision',
        d3.forceCollide().radius((n) => radiusScale(n.degree + n.projectCount) + 14)
      )
      .force('x', d3.forceX((n) => categoryX.get(n.category) ?? width / 2).strength(0.12))
      .force('y', d3.forceY(height / 2).strength(0.08))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaTarget(0.02)
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    const linkGroup = svg.append('g');
    const nodeGroup = svg.append('g');

    const pathSel = linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('stroke', (l) => (l.hasProjectLink ? '#f7d488' : '#57534e'))
      .attr('stroke-width', (l) => (l.hasProjectLink ? 2.4 : 1.2))
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', (l) => (l.hasProjectLink ? null : '4 6'));

    const nodeSel = nodeGroup
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer');

    nodeSel
      .append('circle')
      .attr('r', (n) => radiusScale(n.degree + n.projectCount))
      .attr('fill', (n) => CATEGORY_COLORS[n.category] ?? '#d6d3d1')
      .attr('fill-opacity', 0.92)
      .attr('stroke', '#1a1a1a')
      .attr('stroke-width', 1.5);

    nodeSel
      .append('text')
      .attr('x', (n) => radiusScale(n.degree + n.projectCount) + 5)
      .attr('y', -8)
      .attr('dy', '0.35em')
      .attr('fill', '#fafaf9')
      .attr('font-size', '10px')
      .attr('font-weight', 600)
      .attr('pointer-events', 'none')
      .attr('stroke', '#09090b')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .text((n) => n.id);

    // --- Interaction handlers (update React state, don't rebuild D3) ---
    nodeSel
      .on('mouseenter', (event, n) => setHoveredSkillId(n.id))
      .on('mouseleave', () => setHoveredSkillId(null))
      .on('click', (event, n) => {
        event.stopPropagation();
        setSelectedSkillId((cur) => (cur === n.id ? data.topSkillId : n.id));
      });

    // Drag to pin, double-click to unpin
    nodeSel.call(
      d3
        .drag()
        .on('start', (event, n) => {
          if (!event.active) simulation.alphaTarget(0.15).restart();
          n.fx = n.x;
          n.fy = n.y;
        })
        .on('drag', (event, n) => {
          n.fx = event.x;
          n.fy = event.y;
        })
        .on('end', (event, n) => {
          if (!event.active) simulation.alphaTarget(0.02);
          n.fx = n.x;
          n.fy = n.y;
          n.pinned = true;
          d3.select(event.sourceEvent.target.closest('g'))
            .select('circle')
            .attr('stroke', PIN_COLOR)
            .attr('stroke-width', 3);
        })
    );

    nodeSel.on('dblclick', (event, n) => {
      n.fx = null;
      n.fy = null;
      n.pinned = false;
      d3.select(event.currentTarget)
        .select('circle')
        .attr('stroke', '#1a1a1a')
        .attr('stroke-width', 1.5);
    });

    // Tick: curved arcs + bounded node positions
    simulation.on('tick', () => {
      pathSel.attr('d', (l) => {
        const dx = l.target.x - l.source.x;
        const dy = l.target.y - l.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.4;
        return `M${l.source.x},${l.source.y}A${dr},${dr} 0 0,1 ${l.target.x},${l.target.y}`;
      });

      nodeSel.attr('transform', (n) => {
        n.x = Math.max(30, Math.min(width - 30, n.x));
        n.y = Math.max(30, Math.min(height - 30, n.y));
        return `translate(${n.x},${n.y})`;
      });
    });

    // Expose D3 selections so highlight effect can use them without rebuilding
    highlightRef.current = { pathSel, nodeSel, links };

    return () => {
      simulation.stop();
      simulationRef.current = null;
      highlightRef.current = null;
    };
  }, [data, resolvedWidth, height]);

  // --- Lightweight highlight effect (runs on hover/select, no simulation rebuild) ---
  useEffect(() => {
    const h = highlightRef.current;
    if (!h) return;

    const { pathSel, nodeSel, links: simLinks } = h;
    const active = activeSkillId;

    const linkedPairs = new Set(
      simLinks.flatMap((l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return [`${sId}->${tId}`, `${tId}->${sId}`];
      })
    );

    const isNeighbor = (id) => linkedPairs.has(`${active}->${id}`);

    pathSel
      .attr('stroke-opacity', (l) => {
        if (!active) return 0.3;
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return sId === active || tId === active ? 0.9 : 0.06;
      })
      .attr('stroke', (l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        if (active && (sId === active || tId === active)) return '#fafaf9';
        return l.hasProjectLink ? '#f7d488' : '#57534e';
      });

    nodeSel.select('circle').each(function (n) {
      const el = d3.select(this);
      if (n.pinned) {
        el.attr('stroke', PIN_COLOR).attr('stroke-width', 3);
      } else if (!active) {
        el.attr('opacity', 1).attr('stroke', '#1a1a1a').attr('stroke-width', 1.5);
      } else if (n.id === active) {
        el.attr('opacity', 1).attr('stroke', '#fafaf9').attr('stroke-width', 3);
      } else if (isNeighbor(n.id)) {
        el.attr('opacity', 1).attr('stroke', '#d6d3d1').attr('stroke-width', 1.5);
      } else {
        el.attr('opacity', 0.3).attr('stroke', '#1a1a1a').attr('stroke-width', 1.5);
      }
    });

    nodeSel.select('text').attr('opacity', (n) => {
      if (!active) return 1;
      return n.id === active || isNeighbor(n.id) ? 1 : 0.35;
    });
  }, [activeSkillId]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Skills mapped"
          value={data.nodes.length}
          description="Each node represents a tool, language, or platform I actively use."
        />
        <StatCard
          label="Focus clusters"
          value={data.categories.length}
          description="Clusters group skills by how I think about applying them in practice."
        />
        <StatCard
          label="Project-linked"
          value={projectLinkedCount}
          description="Highlighted ties grow stronger when skills appear together in featured work."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.categories.map((category) => (
          <div key={category} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[category] ?? '#d6d3d1' }}
              />
              <p className="text-ivory">{category}</p>
            </div>
            <p className="mt-2 text-sm text-silver">{CATEGORY_DESCRIPTIONS[category]}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-silver">
          Drag a node to pin it in place. Double-click to release.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-silver">
          <span className="rounded-full border border-white/10 px-3 py-1">
            Solid arcs: project overlap
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Dashed arcs: category adjacency
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <div ref={containerRef} className="p-4 md:p-6">
          <svg ref={svgRef} className="h-auto min-h-[440px] w-full" />
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-silver backdrop-blur transition-colors hover:bg-white/10 hover:text-ivory"
          aria-label={panelOpen ? 'Close skill details' : 'Open skill details'}
        >
          {panelOpen ? '\u2715' : '\u2139'}
        </button>

        {/* Sliding panel */}
        <div
          className={`absolute inset-y-0 right-0 z-10 w-80 transform border-l border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto p-6 pt-14">
            <p className="text-xs uppercase tracking-[0.24em] text-silver">Selected Skill</p>
            {activeSkill ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[activeSkill.category] ?? '#d6d3d1' }}
                  />
                  <h3 className="font-display text-2xl text-ivory">{activeSkill.id}</h3>
                </div>
                <p className="mt-2 text-sm text-silver">
                  {CATEGORY_DESCRIPTIONS[activeSkill.category]}
                </p>
                <div className="mt-4 flex gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5">
                    <span className="text-silver">Category </span>
                    <span className="text-ivory">{activeSkill.category}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5">
                    <span className="text-silver">Connections </span>
                    <span className="text-ivory">{activeSkill.degree}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-silver">Connected skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeSkill.neighbors.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedSkillId(name)}
                        className="rounded-full border border-white/10 px-3 py-1 text-sm text-silver transition-colors hover:border-white/25 hover:text-ivory"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-silver">Featured projects</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeSkill.projects.length > 0 ? (
                      activeSkill.projects.map((title) => (
                        <span
                          key={title}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-silver"
                        >
                          {title}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-silver">
                        Not directly referenced in the featured projects list yet.
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-silver">
                Hover or click a node to see its details here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGraph;
