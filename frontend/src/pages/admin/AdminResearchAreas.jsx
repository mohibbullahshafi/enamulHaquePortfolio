import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiCheck } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function AdminResearchAreas() {
  const { apiFetch } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch('/content/research-areas').then(r => r.json()).then(setAreas).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function updateArea(idx, field, value) {
    setAreas(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  }

  function addArea() {
    setAreas(prev => [...prev, { id: Date.now().toString(), title: '', desc: '', tags: [] }]);
  }

  function removeArea(idx) {
    setAreas(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await apiFetch('/content/research-areas', {
        method: 'PUT',
        body: JSON.stringify(areas),
      });
      if (res.ok) setMsg('Research areas updated!');
      else setMsg('Failed to update.');
    } catch {
      setMsg('Error saving.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Research Areas</h1>
          <p className="text-sm text-muted mt-1">{areas.length} research areas — displayed on the Projects page</p>
        </div>
        <button onClick={addArea} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-4 py-2 rounded-lg transition text-sm">
          <FiPlus size={16} /> Add Area
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('!') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {areas.map((area, idx) => (
          <div key={area.id || idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineLightBulb className="text-accent" size={18} />
                <span className="text-sm font-medium text-muted">Area #{idx + 1}</span>
              </div>
              <button type="button" onClick={() => removeArea(idx)} className="text-red-400 hover:text-red-600 transition">
                <FiTrash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={area.title || ''} onChange={e => updateArea(idx, 'title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input type="text" value={Array.isArray(area.tags) ? area.tags.join(', ') : ''} onChange={e => updateArea(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={2} value={area.desc || ''} onChange={e => updateArea(idx, 'desc', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-y" />
            </div>
          </div>
        ))}

        {areas.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-muted">
            No research areas yet. Click "Add Area" to create one.
          </div>
        )}

        {areas.length > 0 && (
          <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save All Areas'}
          </button>
        )}
      </form>
    </div>
  );
}
