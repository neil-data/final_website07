import React, { useState } from 'react';
import { useQueryStore } from '../store/queryStore';
import { Badge, GradientCard } from '../components/UI';
import { Send, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminQueries = () => {
  const { queries, replyToQuery } = useQueryStore();
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const handleReply = (id: string) => {
    if (!replyText[id]) return;
    replyToQuery(id, replyText[id]);
    toast.success('Reply sent!');
    setReplyText(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-sans font-bold">User Queries</h2>

      <div className="grid grid-cols-1 gap-6">
        {queries.length === 0 && (
          <div className="glass p-10 text-center rounded-2xl">
            <p className="text-text-muted">No queries found.</p>
          </div>
        )}
        {queries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((query) => (
          <GradientCard key={query.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{query.subject}</h3>
                  <Badge color={query.status === 'Solved' ? 'green' : 'yellow'}>
                    {query.status === 'Solved' ? <CheckCircle size={12} className="inline mr-1" /> : <Clock size={12} className="inline mr-1" />}
                    {query.status}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted font-mono">From: {query.name} ({query.email})</p>
                <p className="text-[10px] text-text-muted uppercase font-mono mt-1">Submitted: {new Date(query.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl mb-6">
              <p className="text-sm italic">"{query.message}"</p>
            </div>

            {query.status === 'Solved' ? (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-google-green mb-2">
                  <CheckCircle size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Admin Reply</span>
                </div>
                <p className="text-sm text-white">{query.reply}</p>
                <p className="text-[10px] text-text-muted uppercase font-mono mt-2">Replied: {new Date(query.repliedAt!).toLocaleString()}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={replyText[query.id] || ''}
                  onChange={(e) => setReplyText(prev => ({ ...prev, [query.id]: e.target.value }))}
                  placeholder="Type your reply here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-google-blue transition-all resize-none text-sm"
                  rows={3}
                />
                <button
                  onClick={() => handleReply(query.id)}
                  disabled={!replyText[query.id]}
                  className="bg-google-blue text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-google-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} /> Send Reply
                </button>
              </div>
            )}
          </GradientCard>
        ))}
      </div>
    </div>
  );
};
