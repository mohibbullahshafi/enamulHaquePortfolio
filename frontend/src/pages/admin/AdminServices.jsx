import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminServices() {
  const { apiFetch } = useAuth();
  const [services, setServices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch('/content/services').then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  function updateService(idx, field, value) {
    setServices(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function addService() {
    setServices(prev => [...prev, {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: '💼',
    }]);
  }

  function removeService(idx) {
    setServices(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await apiFetch('/content/services', {
        method: 'PUT',
        body: JSON.stringify(services),
      });
      if (res.ok) setMsg('Services updated!');
      else setMsg('Failed to update.');
    } catch {
      setMsg('Error saving services.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary font-heading">Manage Services</h1>
        <button
          onClick={addService}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-4 py-2 rounded-lg transition text-sm"
        >
          <FiPlus size={16} /> Add Service
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('updated') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {services.map((svc, idx) => (
          <div key={svc.id || idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted">Service #{idx + 1}</span>
              <button type="button" onClick={() => removeService(idx)} className="text-red-400 hover:text-red-600 transition">
                <FiTrash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={svc.title || ''}
                  onChange={e => updateService(idx, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={svc.icon || ''}
                  onChange={e => updateService(idx, 'icon', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={svc.description || ''}
                onChange={e => updateService(idx, 'description', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-y"
              />
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-muted">
            No services yet. Click "Add Service" to create one.
          </div>
        )}

        {services.length > 0 && (
          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Services'}
          </button>
        )}
      </form>
    </div>
  );
}
