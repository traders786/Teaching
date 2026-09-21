import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  Filter,
} from 'lucide-react';
import { api } from '../../lib/api';

interface AdminHelpdeskViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function AdminHelpdeskView({
  onSuccessToast,
  onErrorToast,
}: AdminHelpdeskViewProps) {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  // Selected Ticket State
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replying, setReplying] = useState(false);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await api.getHelpdeskTickets();
      setTickets(res.tickets || []);
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openTicket = async (t: any) => {
    setSelectedTicket(t);
    try {
      const res = await api.getHelpdeskTicketById(t.id);
      setMessages(res.messages || []);
    } catch (e) {}
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      setReplying(true);
      await api.replyHelpdeskTicket(selectedTicket.id, { message: newMessage });
      setNewMessage('');
      const res = await api.getHelpdeskTicketById(selectedTicket.id);
      setMessages(res.messages || []);
      if (onSuccessToast) onSuccessToast('Reply sent and user notified.');
      loadTickets();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to send reply.');
    } finally {
      setReplying(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      await api.updateHelpdeskStatus(selectedTicket.id, status);
      setSelectedTicket((prev: any) => ({ ...prev, status }));
      if (onSuccessToast) onSuccessToast(`Ticket marked as ${status}`);
      loadTickets();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to update status.');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-[#F27C00]" />
            <span>Platform Support Helpdesk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resolve support inquiries and tickets raised by students, parents, and faculty educators.
          </p>
        </div>

        {/* Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === st ? 'bg-white text-[#10182C] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-20 bg-slate-200/70 rounded-xl"></div>
          <div className="h-20 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Tickets Found</h3>
          <p className="text-xs text-slate-500 mt-1">All support inquiries are resolved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => openTicket(t)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition cursor-pointer shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#F27C00]">{t.ticket_number}</span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-medium">
                    Priority: {t.priority}
                  </span>
                </div>
                <h3 className="font-bold text-[#10182C] text-sm mt-1.5">{t.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raised by <strong>{t.user_name}</strong> ({t.user_role}) on {new Date(t.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-xs font-bold text-[#F27C00]">Respond &rarr;</div>
            </div>
          ))}
        </div>
      )}

      {/* TICKET THREAD MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#F27C00]">{selectedTicket.ticket_number}</span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTicket.user_name} ({selectedTicket.user_role})
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#10182C] mt-1">{selectedTicket.subject}</h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="WAITING_FOR_USER">WAITING FOR USER</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <button onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
              {messages.map((msg) => {
                const isMe = msg.sender_role === 'ADMIN' || msg.sender_role === 'SUPER_ADMIN';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-700">{msg.sender_name}</span>
                      <span>({msg.sender_role})</span>
                      <span>&bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] ${
                        isMe
                          ? 'bg-[#10182C] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type response to student/teacher..."
                className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27C00]"
              />
              <button
                type="submit"
                disabled={replying || !newMessage.trim()}
                className="px-4 py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
