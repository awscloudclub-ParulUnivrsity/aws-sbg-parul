import { supabase } from './supabase';

export const api = {
  // Profiles
  getMe: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  },
  updateMe: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  getProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  updateProfile: async (id, updates) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteProfile: async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Events
  getEvents: async () => {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  createEvent: async (eventData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('events').insert({ ...eventData, created_by: user.id }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateEvent: async (id, updates) => {
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteEvent: async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Team
  getTeam: async () => {
    const { data, error } = await supabase.from('team_members').select('*, profile:profiles(*)').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  addTeamMember: async (memberData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('team_members').insert({ ...memberData, approved_by: user.id, approved_at: new Date().toISOString() }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateTeamMember: async (id, updates) => {
    const { data, error } = await supabase.from('team_members').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteTeamMember: async (id) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Certifications
  getCertifications: async () => {
    const { data, error } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  submitCertification: async (certData) => {
    const { data, error } = await supabase.from('certifications').insert({ ...certData, status: 'pending' }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateCertification: async (id, updates) => {
    const { data, error } = await supabase.from('certifications').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteCertification: async (id) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Settings
  getSetting: async (key) => {
    const { data } = await supabase.from('settings').select('*').eq('key', key).single();
    return data || { key, value: {} };
  },
  updateSetting: async (key, value) => {
    const { data, error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // Verify
  verify: async (query) => {
    const { data, error } = await supabase.from('certifications')
      .select('name, cert_title, email, department, credly_link, status, exam_date')
      .eq('status', 'approved')
      .or(`email.ilike.${query},credly_link.ilike.%${query}%`)
      .limit(5);
    if (error) throw new Error(error.message);
    return data;
  },
};
