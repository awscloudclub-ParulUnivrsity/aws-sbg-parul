# AWS SBG Parul University Website

Official website for AWS Student Builder Group at Parul University with dynamic content management and certification tracking.

## 🚀 Features

### Public Website
- **Dynamic Events Page** - Real-time events from database
- **Dynamic Team Page** - Auto-updated team member profiles
- **Certification Submission** - Native form with file uploads
- **Responsive Design** - Mobile-first with dark/light themes
- **Modern UI** - Clean design with Lucide icons

### Admin Dashboard
- **Member Management** - Approve/reject, assign roles
- **Events Management** - Create, edit, delete events
- **Team Management** - Add core team members
- **Certification Review** - Review submissions, generate posts
- **Role-Based Access** - Leader, Technical, Social Media, Operations, Member
- **Digital Badge** - Downloadable member badges

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + CSS-in-JS
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL + Storage)
- **Auth:** Supabase Auth with RLS

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-schema.sql`
3. Run `storage-setup.sql`
4. (Optional) Run `sample-data.sql` for test data

### 4. Create Leader Account
1. Sign up at `/dashboard/login`
2. In Supabase SQL Editor:
```sql
UPDATE public.profiles 
SET role = 'leader', approved = true
WHERE email = 'your@email.com';
```

### 5. Start Development
```bash
npm run dev
```

## 📋 Setup Guide

**Follow the step-by-step guide:** See `SETUP_CHECKLIST.md`

**Detailed features info:** See `DYNAMIC_FEATURES.md`

**Dashboard documentation:** See `DASHBOARD_README.md`

## 🎯 Key Routes

### Public Routes
- `/` - Home page
- `/events` - Dynamic events listing
- `/team` - Dynamic team members
- `/certify` - Certification submission form
- `/about` - About page
- `/contact` - Contact page

### Dashboard Routes (Protected)
- `/dashboard/login` - Sign in / Sign up
- `/dashboard` - Overview (all roles)
- `/dashboard/members` - Manage members (leader, operations)
- `/dashboard/team` - Manage core team (leader)
- `/dashboard/events` - Manage events (leader, technical)
- `/dashboard/certifications` - Review certs (leader, social_media)
- `/dashboard/badge` - Digital badge (member)
- `/dashboard/settings` - Profile settings (all roles)

## 👥 User Roles

| Role | Access |
|------|--------|
| **Leader** | Full access to all features |
| **Technical** | Events management |
| **Social Media** | Certification review |
| **Operations** | Member management |
| **Promotions** | Certification review |
| **Member** | Badge, settings |

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── Navbar.jsx       # Navigation
│   ├── Footer.jsx       # Footer
│   └── MemberCard.jsx   # Team member card
├── context/
│   ├── AuthContext.jsx  # Authentication state
│   └── ThemeContext.jsx # Theme management
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── events/          # Events page
│   ├── team/            # Team page
│   ├── certify/         # Certification form
│   └── dashboard/       # Dashboard pages
├── lib/
│   └── supabase.js      # Supabase client
└── App.jsx              # Routes
```

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Role-based access control
- Email verification (optional)
- Secure file uploads
- Protected dashboard routes

## 📝 Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🧪 Testing

See `TESTING_CHECKLIST.md` for comprehensive testing guide.

## 📄 Additional Documentation

- `SETUP_CHECKLIST.md` - Step-by-step setup guide
- `DYNAMIC_FEATURES.md` - Dynamic features documentation
- `DASHBOARD_README.md` - Dashboard features guide
- `DASHBOARD_UPDATES.md` - Dashboard update logs
- `QUICK_REFERENCE.md` - Quick reference guide
- `supabase-schema.sql` - Database schema
- `storage-setup.sql` - Storage bucket setup
- `sample-data.sql` - Sample data for testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel deploy
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 🐛 Troubleshooting

**Events not showing?**
- Check database has events in `events` table
- Verify RLS policies allow public read

**Can't upload files?**
- Ensure storage bucket `certifications` exists
- Check bucket is public
- Verify file size < 1MB

**Email not confirmed error?**
- Disable email confirmation in Supabase Auth settings

## 📞 Support

For issues:
1. Check browser console (F12) for errors
2. Check Supabase logs
3. Review documentation files
4. Contact AWS SBG team

## 📜 License

MIT License - AWS Student Builder Group, Parul University

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
