import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCheck, FiRefreshCw, FiDatabase, FiGlobe, FiActivity, FiBookOpen, FiUsers, FiMail, FiBriefcase } from 'react-icons/fi';

export default function AdminSettings() {
  const { apiFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ publications: 0, researchAreas: 0, services: 0, messages: 0 });
  const [stats, setStats] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setApiStatus('checking');
    try {
      const [profileRes, pubsRes, areasRes, svcsRes, msgsRes] = await Promise.all([
        apiFetch('/content/profile'),
        apiFetch('/content/publications'),
        apiFetch('/content/research-areas'),
        apiFetch('/content/services'),
        apiFetch('/content/messages'),
      ]);
      const p = await profileRes.json();
      const pubs = await pubsRes.json();
      const areas = await areasRes.json();
      const svcs = await svcsRes.json();
      const msgs = await msgsRes.json();

      setProfile(p);
      setStats(p.stats || {});
      setCounts({
        publications: pubs.length,
        researchAreas: areas.length,
        services: svcs.length,
        messages: msgs.length,
      });
      setApiStatus('online');
    } catch {
      setApiStatus('error');
    }
  }

  async function handleSaveStats(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await apiFetch('/content/profile', {
        method: 'PUT',
        body: JSON.stringify({ stats }),
      });
      if (res.ok) setMsg('Stats updated successfully!');
      else setMsg('Failed to update stats.');
    } catch {
      setMsg('Error saving stats.');
    } finally {
      setSaving(false);
    }
  }

  function updateStat(key, value) {
    setStats(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary font-heading mb-6">Settings & Overview</h1>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FiActivity className="text-accent" size={20} />
          <h2 className="text-lg font-heading font-semibold text-primary">System Status</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${apiStatus === 'online' ? 'bg-green-500' : apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
            <div>
              <p className="text-sm font-medium text-primary">API Server</p>
              <p className="text-xs text-muted">{apiStatus === 'online' ? 'Connected — Port 5001' : apiStatus === 'error' ? 'Connection error' : 'Checking...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-primary">Frontend</p>
              <p className="text-xs text-muted">Running — Port 3005</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FiDatabase className="text-muted" size={14} />
            <div>
              <p className="text-sm font-medium text-primary">Storage</p>
              <p className="text-xs text-muted">JSON file-based (content.json)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FiGlobe className="text-accent" size={20} />
          <h2 className="text-lg font-heading font-semibold text-primary">Content Overview</h2>
          <button onClick={loadAll} className="ml-auto text-muted hover:text-accent transition" title="Refresh"><FiRefreshCw size={16} /></button>
        </div>
        <p className="text-sm text-muted mb-4">All data is dynamic — changes here reflect instantly on the live site.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <FiBookOpen className="mx-auto text-blue-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-blue-700">{counts.publications}</p>
            <p className="text-xs text-blue-600 font-medium">Publications</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <FiUsers className="mx-auto text-emerald-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-emerald-700">{counts.researchAreas}</p>
            <p className="text-xs text-emerald-600 font-medium">Research Areas</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <FiBriefcase className="mx-auto text-purple-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-purple-700">{counts.services}</p>
            <p className="text-xs text-purple-600 font-medium">Services</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl text-center">
            <FiMail className="mx-auto text-orange-600 mb-2" size={22} />
            <p className="text-2xl font-bold text-orange-700">{counts.messages}</p>
            <p className="text-xs text-orange-600 font-medium">Messages</p>
          </div>
        </div>
      </div>

      {/* Google Scholar Stats */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="https://scholar.google.com/favicon.ico" alt="" className="w-5 h-5" />
          <h2 className="text-lg font-heading font-semibold text-primary">Google Scholar Stats</h2>
        </div>
        <p className="text-sm text-muted mb-4">These numbers appear in the stats bar across the site. Update them periodically from Google Scholar.</p>

        {msg && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('!') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSaveStats} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Publications</label>
              <input type="text" value={stats.publications || ''} onChange={e => updateStat('publications', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Citations</label>
              <input type="text" value={stats.citations || ''} onChange={e => updateStat('citations', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">h-index</label>
              <input type="text" value={stats.hindex || ''} onChange={e => updateStat('hindex', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">i10-index</label>
              <input type="text" value={stats.i10index || ''} onChange={e => updateStat('i10index', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mt-5">Since 2021</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citations (since 2021)</label>
              <input type="text" value={stats.citations_since_2021 || ''} onChange={e => updateStat('citations_since_2021', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">h-index (since 2021)</label>
              <input type="text" value={stats.hindex_since_2021 || ''} onChange={e => updateStat('hindex_since_2021', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">i10-index (since 2021)</label>
              <input type="text" value={stats.i10index_since_2021 || ''} onChange={e => updateStat('i10index_since_2021', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Stats'}
          </button>
        </form>

        {profile?.scholar && (
          <div className="mt-4 pt-4 border-t">
            <a href={profile.scholar} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              Open Google Scholar Profile →
            </a>
          </div>
        )}
      </div>

      {/* Dynamic Pages Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Dynamic Pages</h2>
        <p className="text-sm text-muted mb-4">All pages load content from the API. Edit the data here, and the live site updates automatically.</p>
        <div className="space-y-2">
          {[
            { page: 'Home', source: 'Profile, Stats, Top Publications', status: 'dynamic' },
            { page: 'About', source: 'Profile, Timeline, Awards, Fields of Research', status: 'dynamic' },
            { page: 'Projects', source: 'Publications, Research Areas, Scholar Stats', status: 'dynamic' },
            { page: 'Consultancy', source: 'Services', status: 'dynamic' },
            { page: 'Contact', source: 'Profile (email, phone, links)', status: 'dynamic' },
            { page: 'Footer', source: 'Profile (links, description)', status: 'dynamic' },
          ].map(p => (
            <div key={p.page} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm font-medium text-primary w-24">{p.page}</span>
              <span className="text-xs text-muted flex-1">{p.source}</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium uppercase">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
