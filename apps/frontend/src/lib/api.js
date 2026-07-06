import { supabase } from './supabase';

async function request(url, options = {}) {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session;
  } catch (err) {
    console.warn('Failed to retrieve Supabase session:', err);
  }

  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export const api = {
  // Profiles
  getMe: () => request('/api/profiles/me'),
  updateMe: (data) => request('/api/profiles/me', { method: 'PUT', body: JSON.stringify(data) }),
  getProfiles: () => request('/api/profiles'),
  updateProfile: (id, data) => request(`/api/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProfile: (id) => request(`/api/profiles/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => request('/api/events'),
  createEvent: (data) => request('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),

  // Team
  getTeam: () => request('/api/team'),
  addTeamMember: (data) => request('/api/team', { method: 'POST', body: JSON.stringify(data) }),
  updateTeamMember: (id, data) => request(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeamMember: (id) => request(`/api/team/${id}`, { method: 'DELETE' }),

  // Certifications
  getCertifications: () => request('/api/certifications'),
  submitCertification: (data) => request('/api/certifications', { method: 'POST', body: JSON.stringify(data) }),
  updateCertification: (id, data) => request(`/api/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertification: (id) => request(`/api/certifications/${id}`, { method: 'DELETE' }),

  // Settings
  getSetting: (key) => request(`/api/settings/${key}`),
  updateSetting: (key, value) => request(`/api/settings/${key}`, { method: 'POST', body: JSON.stringify({ value }) }),

  // Verify
  verify: (query) => request(`/api/verify?query=${encodeURIComponent(query)}`),
};
