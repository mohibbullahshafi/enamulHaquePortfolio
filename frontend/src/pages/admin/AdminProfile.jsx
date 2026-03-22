import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { apiFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch('/content/profile').then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await apiFetch('/content/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (res.ok) setMsg('Profile updated successfully!');
      else setMsg('Failed to update.');
    } catch {
      setMsg('Error updating profile.');
    } finally {
      setSaving(false);
    }
  }

  function update(field, value) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  if (!profile) return <p className="text-muted">Loading...</p>;

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'title', label: 'Title / Position' },
    { key: 'university', label: 'University' },
    { key: 'school', label: 'School / Department' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn URL' },
    { key: 'scholar', label: 'Google Scholar URL' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary font-heading mb-6">Edit Profile</h1>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-2xl">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={profile[f.key] || ''}
              onChange={e => update(f.key, e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Summary</label>
          <textarea
            rows={5}
            value={profile.bio || ''}
            onChange={e => update('bio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests (comma-separated)</label>
          <input
            type="text"
            value={Array.isArray(profile.research_interests) ? profile.research_interests.join(', ') : (profile.research_interests || '')}
            onChange={e => update('research_interests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
