import React, { useState, useEffect, useRef } from 'react';
import { aiAPI, problemsAPI } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Bot, User, Send, Sparkles, Code2, Lightbulb, MessageSquare } from 'lucide-react';

export const AIMentorPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your personal AI DSA Mentor. I have full context of your diagnostic assessment, active roadmap phase, and error history. What algorithmic pattern or code problem would you like to explore today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('binary-search');
  const [topics, setTopics] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const res = await problemsAPI.getTopics();
        setTopics(res.data.data);
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    };
    loadTopics();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        message: text,
        topicSlug: selectedTopic,
        conversationId
      });

      const reply = res.data.data.reply;
      setConversationId(res.data.data.conversationId);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply.text }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Encountered an issue reaching AI mentor service. Using offline pedagogical mode: Focus on the invariant boundaries of your pointers to prevent off-by-one errors.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I identify when to use Sliding Window vs Two Pointer?',
    'Explain Binary Search on Answer Space with intuition',
    'Why is recursion stack space O(N) in worst case?',
    'Give me a Socratic hint without spoiling the solution'
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 flex flex-col h-[calc(100vh-6rem)] space-y-4 animate-fade-in">
      {/* Mentor Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Socratic AI DSA Mentor
              <Badge variant="brand" size="sm">Online</Badge>
            </h1>
            <p className="text-[11px] text-gray-400">Context-aware personal tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Active Focus:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
          >
            {topics.map(t => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-950/60 border-gray-800">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-brand-500 text-gray-950 font-bold text-xs'
                    : 'bg-gray-900 border border-gray-800 text-brand-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand-500/15 border border-brand-500/30 text-white rounded-tr-none'
                    : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-brand-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </Card>

      {/* Suggested Fast Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs whitespace-nowrap transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-800 rounded-2xl shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask mentor about an algorithm, bug, or time complexity derivation..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
        />
        <Button
          size="md"
          variant="primary"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || loading}
          className="rounded-xl px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
