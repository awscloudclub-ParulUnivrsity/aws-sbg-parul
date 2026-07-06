import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const prisma = new PrismaClient();

// Helper for sanitized error reporting
const sendError = (res, err, defaultMsg = 'An unexpected database error occurred.') => {
  console.error(err);
  res.status(500).json({ error: defaultMsg });
};

let supabase = null;
try {
  const sbUrl = process.env.VITE_SUPABASE_URL;
  const sbKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (sbUrl && sbUrl.startsWith('http') && sbKey && sbKey !== 'your_supabase_anon_key_here') {
    supabase = createClient(sbUrl, sbKey);
  } else {
    console.warn('⚠️ Warning: Supabase environment variables are missing or placeholders. Supabase Auth will be bypassed or disabled.');
  }
} catch (err) {
  console.warn('⚠️ Warning: Failed to initialize Supabase client:', err.message);
}

// Auth Middleware: Verifies Supabase User JWT and syncs user to Neon public.profiles
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  if (!supabase) {
    console.warn('Supabase client not initialized. Cannot verify authentication token.');
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      req.user = null;
      return next();
    }

    // Sync profile to Neon if it doesn't exist yet (replaces DB trigger)
    let profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });

    if (!profile) {
      // Check if registration is enabled
      const regSetting = await prisma.setting.findUnique({
        where: { key: 'registration_enabled' }
      });
      const isRegEnabled = regSetting ? (regSetting.value && regSetting.value.enabled !== false) : true;

      if (!isRegEnabled) {
        console.warn(`Registration blocked for new user: ${user.email} (registration_enabled is disabled).`);
        req.user = null;
        return next();
      }

      profile = await prisma.profile.create({
        data: {
          id: user.id,
          name: user.user_metadata?.name || user.email.split('@')[0],
          email: user.email,
          role: 'member',
          approved: false,
          password_set: true
        }
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
      approved: profile.approved
    };
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    req.user = null;
    next();
  }
};

app.use(authenticate);

// Authorization Helpers
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
};

const requireApproved = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (!req.user.approved && req.user.role !== 'leader') {
    return res.status(403).json({ error: 'Account pending approval' });
  }
  next();
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// ==========================================
// 1. PROFILES ENDPOINTS
// ==========================================

// Get current user profile
app.get('/api/profiles/me', requireAuth, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id }
    });
    res.json(profile);
  } catch (err) {
    sendError(res, err, 'Failed to fetch current profile.');
  }
});

// Update current user profile
app.put('/api/profiles/me', requireAuth, async (req, res) => {
  const { name, department, enrollment, institute, mobile, avatar_url, badge_url, password_set } = req.body;
  try {
    const updated = await prisma.profile.update({
      where: { id: req.user.id },
      data: {
        name,
        department,
        enrollment,
        institute,
        mobile,
        avatar_url,
        badge_url,
        password_set: password_set !== undefined ? password_set : undefined
      }
    });
    res.json(updated);
  } catch (err) {
    sendError(res, err, 'Failed to update current profile.');
  }
});

// Get all profiles (authorized users only)
app.get('/api/profiles', requireApproved, async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(profiles);
  } catch (err) {
    sendError(res, err, 'Failed to retrieve profiles.');
  }
});

// Update profile by ID (Leader only)
app.put('/api/profiles/:id', requireRole(['leader']), async (req, res) => {
  const { id } = req.params;
  const { role, approved, department } = req.body;
  try {
    // Prevent self-demotion
    if (id === req.user.id && role && role !== 'leader') {
      return res.status(400).json({ error: 'Leaders cannot demote themselves.' });
    }

    const updated = await prisma.profile.update({
      where: { id },
      data: { role, approved, department }
    });
    res.json(updated);
  } catch (err) {
    sendError(res, err, 'Failed to update profile settings.');
  }
});

// Delete profile by ID (Leader only)
app.delete('/api/profiles/:id', requireRole(['leader']), async (req, res) => {
  const { id } = req.params;
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Leaders cannot delete their own profile.' });
  }
  try {
    // Delete profile and cascaded relations
    await prisma.$transaction([
      prisma.teamMember.deleteMany({ where: { profile_id: id } }),
      prisma.profile.delete({ where: { id } })
    ]);
    res.json({ success: true });
  } catch (err) {
    sendError(res, err, 'Failed to delete profile and associated records.');
  }
});

// ==========================================
// 2. EVENTS ENDPOINTS
// ==========================================

// Get all events (public)
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(events);
  } catch (err) {
    sendError(res, err, 'Failed to fetch events list.');
  }
});

// Create event (Leader or Technical only)
app.post('/api/events', requireRole(['leader', 'technical']), async (req, res) => {
  const { title, type, date } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required and must be a valid string.' });
  }
  if (!type || typeof type !== 'string' || !type.trim()) {
    return res.status(400).json({ error: 'Type is required and must be a valid string.' });
  }
  if (!date || typeof date !== 'string' || !date.trim()) {
    return res.status(400).json({ error: 'Date is required and must be a valid string.' });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        type: type.trim(),
        date: date.trim(),
        time: req.body.time,
        location: req.body.location,
        description: req.body.description,
        status: req.body.status || 'upcoming',
        created_by: req.user.id
      }
    });
    res.json(event);
  } catch (err) {
    sendError(res, err, 'Failed to create event.');
  }
});

// Update event (Leader or Technical only)
app.put('/api/events/:id', requireRole(['leader', 'technical']), async (req, res) => {
  const { id } = req.params;
  const { title, type, date } = req.body;

  if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Title must be a non-empty string.' });
  }
  if (type !== undefined && (!type || typeof type !== 'string' || !type.trim())) {
    return res.status(400).json({ error: 'Type must be a non-empty string.' });
  }
  if (date !== undefined && (!date || typeof date !== 'string' || !date.trim())) {
    return res.status(400).json({ error: 'Date must be a non-empty string.' });
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: req.body
    });
    res.json(event);
  } catch (err) {
    sendError(res, err, 'Failed to update event details.');
  }
});

// Delete event (Leader or Technical only)
app.delete('/api/events/:id', requireRole(['leader', 'technical']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    sendError(res, err, 'Failed to delete event.');
  }
});

// ==========================================
// 3. TEAM MEMBERS ENDPOINTS
// ==========================================

// Get all team members (public)
app.get('/api/team', async (req, res) => {
  try {
    const team = await prisma.teamMember.findMany({
      include: {
        profile: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(team);
  } catch (err) {
    sendError(res, err, 'Failed to fetch team members.');
  }
});

// Add team member (Leader only)
app.post('/api/team', requireRole(['leader']), async (req, res) => {
  const { profile_id, role_title, department, linkedin, github } = req.body;
  if (!profile_id || typeof profile_id !== 'string' || !profile_id.trim()) {
    return res.status(400).json({ error: 'profile_id is required and must be a valid string.' });
  }
  try {
    const member = await prisma.teamMember.create({
      data: {
        profile_id,
        role_title,
        department,
        linkedin,
        github,
        approved_by: req.user.id,
        approved_at: new Date()
      }
    });
    res.json(member);
  } catch (err) {
    sendError(res, err, 'Failed to add team member.');
  }
});

// Update team member (Leader only)
app.put('/api/team/:id', requireRole(['leader']), async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: req.body
    });
    res.json(member);
  } catch (err) {
    sendError(res, err, 'Failed to update team member details.');
  }
});

// Delete team member (Leader only)
app.delete('/api/team/:id', requireRole(['leader']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.teamMember.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    sendError(res, err, 'Failed to remove team member.');
  }
});

// ==========================================
// 4. CERTIFICATIONS ENDPOINTS
// ==========================================

// Get all certifications (Leader or Social Media only)
app.get('/api/certifications', requireRole(['leader', 'social_media']), async (req, res) => {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(certs);
  } catch (err) {
    sendError(res, err, 'Failed to retrieve certifications.');
  }
});

// Submit certification (public/anonymous)
app.post('/api/certifications', async (req, res) => {
  const { name, email, certificate_title, credly_link } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required and must be a valid string.' });
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required and must be a valid string.' });
  }
  if (!certificate_title || typeof certificate_title !== 'string' || !certificate_title.trim()) {
    return res.status(400).json({ error: 'Certificate title is required and must be a valid string.' });
  }
  if (!credly_link || typeof credly_link !== 'string' || !credly_link.trim()) {
    return res.status(400).json({ error: 'Credly link is required and must be a valid string.' });
  }

  try {
    const cert = await prisma.certification.create({
      data: {
        ...req.body,
        status: 'pending'
      }
    });
    res.json(cert);
  } catch (err) {
    sendError(res, err, 'Failed to submit certification details.');
  }
});

// Update certification status or draft (Leader or Social Media only)
app.put('/api/certifications/:id', requireRole(['leader', 'social_media']), async (req, res) => {
  const { id } = req.params;
  const { status, post_draft } = req.body;
  try {
    const cert = await prisma.certification.update({
      where: { id },
      data: { status, post_draft }
    });
    res.json(cert);
  } catch (err) {
    sendError(res, err, 'Failed to update certification records.');
  }
});

// Delete certification (Leader only)
app.delete('/api/certifications/:id', requireRole(['leader']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.certification.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    sendError(res, err, 'Failed to delete certification record.');
  }
});

// ==========================================
// 5. GLOBAL SETTINGS
// ==========================================

// Get setting by key (public)
app.get('/api/settings/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    res.json(setting || { key, value: {} });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve setting value.');
  }
});

// Update setting (Leader only)
app.post('/api/settings/:key', requireRole(['leader']), async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (value === undefined) {
    return res.status(400).json({ error: 'Value setting payload is required.' });
  }
  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value,
        updated_at: new Date(),
        updated_by: req.user.id
      },
      create: {
        key,
        value,
        updated_by: req.user.id
      }
    });
    res.json(setting);
  } catch (err) {
    sendError(res, err, 'Failed to update setting.');
  }
});

// ==========================================
// 6. CERTIFICATE LOOKUP / VERIFY
// ==========================================

// Verify certificate by email or credly link (public)
app.get('/api/verify', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const certs = await prisma.certification.findMany({
      where: {
        status: 'approved',
        OR: [
          { email: { equals: query, mode: 'insensitive' } },
          { credly_link: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        name: true,
        certificate_title: true,
        email: true,
        department: true,
        credly_link: true,
        status: true,
        exam_date: true
      },
      take: 5
    });
    res.json(certs);
  } catch (err) {
    sendError(res, err, 'Failed to verify certificate.');
  }
});

// Seed default settings on startup
const seedSettings = async () => {
  try {
    await prisma.setting.upsert({
      where: { key: 'registration_enabled' },
      update: {},
      create: {
        key: 'registration_enabled',
        value: { enabled: true }
      }
    });
    console.log('Database settings successfully seeded.');
  } catch (err) {
    console.error('Error seeding settings:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await seedSettings();
});
