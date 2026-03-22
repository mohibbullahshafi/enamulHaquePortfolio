import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiCheck, FiBookOpen, FiFileText } from 'react-icons/fi';

export default function AdminPublications() {
  const { apiFetch } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(null); // id or 'new'
  const [form, setForm] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await apiFetch('/content/publications');
      setPublications(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }

  const emptyPub = { title: '', authors: '', journal: '', year: new Date().getFullYear(), type: 'journal', volume: '', publisher: '', doi: '', citations: 0 };

  function startAdd() {
    setEditing('new');
    setForm({ ...emptyPub });
    setMsg('');
  }

  function startEdit(pub) {
    setEditing(pub.id);
    setForm({ ...pub });
    setMsg('');
  }

  function cancelEdit() {
    setEditing(null);
    setForm({});
  }

  async function handleSave() {
    if (!form.title || !form.authors) {
      setMsg('Title and authors are required.');
      return;
    }
    setMsg('');

    try {
      if (editing === 'new') {
        const res = await apiFetch('/content/publications', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const data = await res.json();
          setPublications(prev => [...prev, data.publication]);
          setMsg('Publication added!');
        }
      } else {
        const res = await apiFetch(`/content/publications/${editing}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setPublications(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
          setMsg('Publication updated!');
        }
      }
      setEditing(null);
      setForm({});
    } catch {
      setMsg('Error saving publication.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this publication?')) return;
    try {
      await apiFetch(`/content/publications/${id}`, { method: 'DELETE' });
      setPublications(prev => prev.filter(p => p.id !== id));
      setMsg('Publication deleted.');
    } catch {
      setMsg('Error deleting.');
    }
  }

  const sorted = [...publications].sort((a, b) => b.year - a.year);
  const journalCount = publications.filter(p => p.type === 'journal').length;
  const confCount = publications.filter(p => p.type === 'conference').length;
  const totalCitations = publications.reduce((sum, p) => sum + (p.citations || 0), 0);

  if (loading) return <p className="text-muted">Loading publications...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Publications</h1>
          <p className="text-sm text-muted mt-1">
            {publications.length} total &middot; {journalCount} journals &middot; {confCount} conferences &middot; {totalCitations} citations
          </p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-4 py-2 rounded-lg transition text-sm">
          <FiPlus size={16} /> Add Publication
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('!') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Add / Edit Form */}
      {editing !== null && (
        <div className="bg-white rounded-xl border-2 border-accent/30 shadow-sm p-6 mb-6">
          <h3 className="font-heading font-semibold text-primary mb-4">{editing === 'new' ? 'Add New Publication' : 'Edit Publication'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Authors *</label>
              <input type="text" value={form.authors || ''} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Journal / Conference</label>
              <input type="text" value={form.journal || ''} onChange={e => setForm(f => ({ ...f, journal: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input type="text" value={form.publisher || ''} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={form.year || ''} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || '' }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type || 'journal'} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition">
                <option value="journal">Journal</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume / Pages</label>
              <input type="text" value={form.volume || ''} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
              <input type="text" value={form.doi || ''} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citations</label>
              <input type="number" value={form.citations || 0} onChange={e => setForm(f => ({ ...f, citations: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button onClick={handleSave} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-5 py-2 rounded-lg transition text-sm">
              <FiCheck size={16} /> {editing === 'new' ? 'Add' : 'Save'}
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition text-sm">
              <FiX size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Publications List */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-muted">
          <FiBookOpen size={32} className="mx-auto mb-3 text-gray-300" />
          No publications yet. Click "Add Publication" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(pub => (
            <div key={pub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-accent/20 transition">
              <div className="flex items-start gap-3">
                <span className={`mt-1 px-2 py-0.5 rounded text-xs font-semibold uppercase shrink-0 ${pub.type === 'journal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {pub.type === 'journal' ? 'J' : 'C'}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary text-sm leading-snug">{pub.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{pub.authors}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-1">
                    <span className="font-medium text-accent">{pub.journal}</span>
                    <span>{pub.year}</span>
                    {pub.citations > 0 && <span className="text-green-600 font-medium">{pub.citations} citations</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(pub)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition" title="Edit">
                    <FiEdit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(pub.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition" title="Delete">
                    <FiTrash2 size={15} />
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
