// Site content and data
// Edit this file to update your personal information

export const siteConfig = {
  name: "Isaac Lo",
  title: "Software Engineer & Research Assistant",
  affiliation: "Georgia Institute of Technology",
  email: "ljzisaaac@gmail.com",
  location: "Atlanta, GA",
  social: {
    github: "https://github.com/iljz",
    linkedin: "https://www.linkedin.com/in/iljz/",
    // googleScholar: "#"
  }
};

export const photos = [
  { src: '/photos/mirror.png', caption: 'Chicago' },
  { src: '/photos/hike.png', caption: 'Hiking' },
  { src: '/photos/newyears.png', caption: 'New Years 2023' },
  { src: '/photos/sensorsetup.png', caption: 'Senior Design Project' },
  { src: '/photos/grad.jpg', caption: 'Graduation' },
  { src: '/photos/minasan.png', caption: 'Behind the counter' },
  { src: '/photos/panel.jpg', caption: 'Redefining the Narrative Speaker Panel' },
];

export const bio = [
  "I'm someone excited about building systems to solve real-world problems. I'm currently a completing my Master's in Computer Science at Georgia Tech, with a focus on machine learning and human-AI interaction. ",
  "I'm working as a Research Assistant at the Design Intelligence Lab where I'm building systems and exploring the application of AI in education.",
  // "One thing I truly enjoy is building community. I'm always excited to connect with people and learn from them. Feel free to reach out if you want to collaborate, chat about research, or just say hello."
];

export const projects = [
  {
    title: "PICO Scholar - AI Lit Reviews",
    description: "Built an accelerated biomedical literature review platform utilizing RAG and fine-tuned models (2nd Place at Red Hat & Intel AI Hackathon). Developed a system with LlamaIndex and FastAPI to generate multi-document summaries and context-aware chatbots for 120+ research papers, using MongoDB for chat persistence.",
    tech: ["Python", "LlamaIndex", "FastAPI", "MongoDB"],
    link: "https://github.com/datagero/pico-scholar",
    year: "2025"
  },
  {
    title: "Constrained LLM Post-Training Optimization",
    description: "Optimized SFT and RL post-training for Qwen3-4B under a strict 1-GPU/24-hour budget. Utilized 4-bit quantization and LoRA to reduce memory footprint by 15%. Conducted hyperparameter ablation studies across GRPO loss variants, identifying a 1e-05 learning rate regime that swung reasoning accuracy by 14.6% to achieve a Pass@1 score of 0.8901 on the GSM8K benchmark.",
    tech: ["Python", "Qwen3", "LoRA", "GRPO"],
    link: "#",
    year: "2025"
  },
  {
    title: "Fading the Crowd: Prediction Market Visualizer",
    description: "Developed an interactive data visualization platform analyzing macroeconomic prediction markets. Engineered dynamic charts for Implied vs. Realized Probability, a microstructure heatmap, and a strategy simulator to backtest and exploit favorite-longshot biases across massive trading datasets.",
    tech: ["Data Visualization", "Python", "React"],
    link: "#",
    year: "2024"
  },
  {
    title: "SEC 10-K Filings AI Assistant",
    description: "Engineered an AI agent designed to navigate, analyze, and retrieve targeted information from complex corporate SEC 10-K filings. Developed a reasoning layer to intelligently categorize user queries across the 15 standard 10-K items, streamlining the financial document review process.",
    tech: ["Python", "LLMs", "Prompt Engineering"],
    link: "#",
    year: "2024"
  }
];

export const publications = [
  {
    title: "Advanced Machine Learning Techniques for Data Analysis",
    venue: "Journal of Computer Science",
    year: "2024",
    link: "#"
  },
  {
    title: "Neural Networks in Modern Computing Applications",
    venue: "IEEE Transactions on Neural Networks",
    year: "2023",
    link: "#"
  },
  {
    title: "Computational Methods for Complex Systems",
    venue: "Nature Computing",
    year: "2023",
    link: "#"
  }
];

export const experience = [
  {
    role: "Graduate Research Assistant",
    organization: "Georgia Institute of Technology",
    location: "Atlanta, GA",
    period: "2024 — Present",
    bullets: [
      "Designed, built, and deployed an AI Virtual TA to 800+ students across 3 universities, using a multi-modal chat agent to process course documents and deliver grounded, GPT-4-powered answers for online learning",
      "Increased retrieval relevance and answer confidence for 77% of users by implementing a multi-representation strategy in Python, querying across textual and visual data collections on a vector database",
      "Spearheaded the integration of an LTI-compliant front-end web app using TypeScript and designed a PDF viewer feature that enabled easy fact-verification and interactive reading, achieving a 97% user approval rating",
      "Architected a microservice ecosystem on AWS (EC2, S3) with 5 independently scalable services (e.g., encoding, response generation), containerized with Docker and managed via a reverse proxy"
    ]
  },
  {
    role: "Software Engineering Intern",
    organization: "Stryker",
    location: "San Jose, CA",
    period: "Summer 2025",
    bullets: [
      "Engineered a Java Spring Boot microservice that entirely eliminated ~30s of downtime and failovers that interrupt processes during firmware upgrades, resolving a critical reliability issue for hospital communication devices",
      "Re-architected legacy updater process by extracting it from a monolithic codebase into an independent service, decoupling server dependencies and reducing code complexity by 40%",
      "Implemented a communication layer between the legacy server and the new standalone updater, defining REST API layer and interaction logic for bi-directional communication and recovery on partial outages",
      "Designed and developed the end-to-end firmware deployment workflow, from a React-based admin client to low-latency UDP signals, enabling administrators to update 50+ hospital devices with a single click"
    ]
  },
  {
    role: "Undergraduate Research Assistant",
    organization: "University of Illinois at Urbana-Champaign",
    location: "Champaign, IL",
    period: "2022 — 2024",
    bullets: [
      "Conducted research on computational fluid dynamics and machine learning integration",
      "Published findings in peer-reviewed journals",
      "Mentored junior students in research methodologies"
    ]
  }
];

export const education = [
  {
    degree: "M.S. Computer Science",
    school: "Georgia Institute of Technology - Atlanta Campus",
    period: "2024 — 2026",
    details: "Specialization in Machine Learning",
    coursework: [
      "Machine Learning",
      "Deep Reinforcement Learning",
      "Artificial Intelligence",
      "Conversation AI",
      "Data Visualization & Analytics",
      "Graduate Algorithms"
    ]
  },
  {
    degree: "B.S. Mechanical Engineering",
    school: "University of Illinois at Urbana-Champaign",
    period: "2020 — 2024",
    details: "Minor in Computer Science",
    coursework: [
      "Data Structures and Algorithms",
      "Computational Photography",
      "Biomechanical Systems",
      ""
    ]
  }
];

export const skills = {
  "Languages": ["Python", "JavaScript/TypeScript", "C++", "Java", "SQL", "R", "MATLAB"],
  "ML/AI": ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "LangChain"],
  "Web & Backend": ["React", "Node.js", "FastAPI", "PostgreSQL", "MongoDB"],
  "Tools & Infrastructure": ["Git", "Docker", "Kubernetes", "AWS", "Linux", "LaTeX"]
};

export const navItems = ['Home', 'Resume', 'Projects', 'Publications'];

