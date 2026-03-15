import React, { useMemo, useState } from 'react';
import { Bot, LoaderCircle, Send, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm Isaac's AI assistant. Ask about his background, projects, skills, research, or how to get in touch.",
};

const DEFAULT_CHAT_API_URL = 'http://127.0.0.1:5001/chat';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatProjectList = (projects) =>
  projects
    .slice(0, 3)
    .map((project) => `${project.title}: ${project.description}`)
    .join(' ');

const buildMockReply = (message, context) => {
  const prompt = message.toLowerCase();
  const { bio, projects, skills, siteConfig } = context;

  if (prompt.includes('project') || prompt.includes('build') || prompt.includes('portfolio')) {
    return `Here are a few representative projects. ${formatProjectList(projects)}`;
  }

  if (
    prompt.includes('skill') ||
    prompt.includes('stack') ||
    prompt.includes('technology') ||
    prompt.includes('tech')
  ) {
    const skillSummary = Object.entries(skills)
      .map(([category, items]) => `${category}: ${items.slice(0, 4).join(', ')}`)
      .join(' | ');
    return `Isaac's technical profile spans several areas. ${skillSummary}.`;
  }

  if (
    prompt.includes('research') ||
    prompt.includes('ai') ||
    prompt.includes('machine learning') ||
    prompt.includes('ml')
  ) {
    return "Isaac is currently a Master's student in Computer Science at Georgia Tech focused on machine learning and human-AI interaction. He is also working as a Research Assistant in the Design Intelligence Lab on AI in education and intelligent systems.";
  }

  if (
    prompt.includes('contact') ||
    prompt.includes('email') ||
    prompt.includes('reach') ||
    prompt.includes('connect')
  ) {
    return `You can reach Isaac at ${siteConfig.email}. He's based in ${siteConfig.location} and is open to conversations about research, engineering, and collaboration.`;
  }

  if (
    prompt.includes('who are you') ||
    prompt.includes('about') ||
    prompt.includes('background') ||
    prompt.includes('introduce')
  ) {
    return bio.join(' ');
  }

  return `A quick summary: ${bio.join(' ')} If you'd like, you can ask me about projects, skills, research, or contact information.`;
};

const markdownComponents = {
  p: ({ ...props }) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
  ul: ({ ...props }) => <ul className="my-2 list-disc space-y-1 pl-5" {...props} />,
  ol: ({ ...props }) => <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  a: ({ ...props }) => (
    <a
      className="underline decoration-white/40 underline-offset-2 hover:decoration-white/80"
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  code: ({ inline, ...props }) =>
    inline ? (
      <code className="rounded bg-black/30 px-1 py-0.5 text-xs" {...props} />
    ) : (
      <code className="block overflow-x-auto rounded-lg bg-black/35 p-3 text-xs" {...props} />
    ),
};

const MessageBubble = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-silver">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'border border-white/10 bg-white/[0.04] text-silver'
            : 'bg-ivory text-black'
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
      {!isAssistant && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-ivory/10 text-ivory">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

const ChatWindow = ({ bio, projects, siteConfig, skills }) => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL || DEFAULT_CHAT_API_URL;
  const usingConfiguredBackend = Boolean(import.meta.env.VITE_CHAT_API_URL);
  const suggestions = useMemo(
    () => [
      'What kind of work does Isaac do?',
      'Tell me about his projects',
      'What are his strongest technical skills?',
      'How can I get in touch?',
    ],
    []
  );

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();

    if (!message || isLoading) {
      return;
    }

    const nextUserMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    };

    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      let reply;

      if (chatApiUrl) {
        const response = await fetch(chatApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            history: nextMessages.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Chat request failed with ${response.status}`);
        }

        const payload = await response.json();
        reply = payload.reply || payload.message || payload.output;
      } else {
        await wait(700);
        reply = buildMockReply(message, { bio, projects, siteConfig, skills });
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            reply ||
            "I couldn't generate a reply just now, but you can try another question.",
        },
      ]);
    } catch {
      const fallbackReply = buildMockReply(message, { bio, projects, siteConfig, skills });
      setMessages((current) => [
        ...current,
        {
          id: `assistant-fallback-${Date.now()}`,
          role: 'assistant',
          content: `${fallbackReply} (Currently using the mock fallback because the backend is unavailable.)`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.24em]">
                {usingConfiguredBackend ? 'Configured Chat Agent' : 'Local Chat Agent'}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium">
              Ask My RAG Agent
            </h2>
            <p className="max-w-2xl text-silver">
              Ask anything!
            </p>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-silver">
            {/* {usingConfiguredBackend ? 'Custom backend URL' : 'Local backend + mock fallback'} */}
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendMessage(suggestion)}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-silver transition-colors hover:border-white/25 hover:text-ivory"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[28rem] space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-silver">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-white/10 px-6 py-5"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about projects, research, skills, or contact info..."
            className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-silver outline-none transition-colors placeholder:text-stone focus:border-white/25"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-ivory px-5 py-3 text-sm text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
