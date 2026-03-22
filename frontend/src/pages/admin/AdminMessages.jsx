import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiCheck, FiMail } from 'react-icons/fi';

export default function AdminMessages() {
  const { apiFetch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await apiFetch('/content/messages');
      setMessages(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    await apiFetch(`/content/messages/${id}/read`, { method: 'PUT' });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }

  async function deleteMsg(id) {
    await apiFetch(`/content/messages/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  if (loading) return <p className="text-muted">Loading messages...</p>;

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Messages</h1>
          <p className="text-sm text-muted mt-1">{messages.length} total, {unread} unread</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-muted">
          <FiMail size={32} className="mx-auto mb-3 text-gray-300" />
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(m => (
            <div
              key={m.id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${!m.read ? 'border-accent/30 bg-blue-50/30' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary">{m.name}</span>
                    {!m.read && (
                      <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-medium">NEW</span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{m.email}</p>
                  {m.subject && <p className="text-sm font-medium text-gray-700 mt-2">{m.subject}</p>}
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{m.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!m.read && (
                    <button
                      onClick={() => markRead(m.id)}
                      className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition"
                      title="Mark as read"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMsg(m.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
