# MindSpace - AI-Powered Wellness Diary

A production-ready mental wellness application with secure authentication, AI-powered insights, and comprehensive wellness tracking.

## 🚀 Features

### Authentication & Security
- ✅ **Secure Sign Up** - Email/password with validation
- ✅ **Login** - Credential verification against Supabase Auth
- ✅ **Forgot Password** - Email-based password reset
- ✅ **Session Management** - JWT-based authentication with auto-refresh
- ✅ **Protected Routes** - Diary, Therapy, Community pages require authentication
- ✅ **Secure Logout** - Clears session and redirects to homepage

### Core Features
- 📝 **AI-Powered Journaling** - Daily entries with mood tracking
- 🧠 **AI Insights** - Pattern recognition and personalized recommendations
- 📊 **Analytics Dashboard** - Mood trends and progress tracking
- 🗓️ **Calendar View** - Visual mood history
- 💆 **Therapy Search** - Find and book therapists
- 👥 **Community Hub** - Support groups and buddy matching
- ⚙️ **Account Management** - Profile, preferences, and privacy settings

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)

### 1. Clone and Install
```bash
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize

#### Get Credentials
1. Go to Project Settings → API
2. Copy your project URL and anon key

#### Create Database Tables
Run this SQL in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create journal_entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  gratitude TEXT[] DEFAULT '{}',
  intentions TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id TEXT NOT NULL,
  therapist_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 3. Configure Environment Variables

Create `.env` file in project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic API (for AI features)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

# Proxy Server (for 3rd party API requests)
VITE_PROXY_SERVER_ACCESS_TOKEN=undefined
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔐 Security Features

### Password Security
- Minimum 8 characters required
- Passwords hashed by Supabase Auth (bcrypt)
- Never stored in plain text

### Session Management
- JWT-based authentication
- Automatic token refresh
- Secure session storage
- Session expiry handling

### Route Protection
- Protected routes require authentication
- Fail-secure defaults (deny if unclear)
- Automatic redirect to login
- Post-login redirect to originally requested page

### Database Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure API endpoints
- SQL injection prevention

## 📱 User Flows

### Sign Up Flow
1. User clicks "Get Started" or "Sign Up"
2. Enters name, email, and password
3. Password validated (8+ characters)
4. Account created in Supabase Auth
5. Profile created in database
6. Automatically logged in
7. Redirected to Diary page

### Login Flow
1. User enters email and password
2. Credentials verified against Supabase
3. JWT token issued
4. User data loaded from database
5. Redirected to originally requested page or Diary

### Forgot Password Flow
1. User clicks "Forgot Password"
2. Enters email address
3. Reset link sent to email
4. User clicks link in email
5. Enters new password
6. Password updated in Supabase
7. Redirected to login

### Logout Flow
1. User clicks "Sign Out"
2. Session cleared from Supabase
3. Local state cleared
4. Redirected to homepage

## 🎨 Design System

### Colors
- **Sage Green**: Primary (#7dae7d, #365d36)
- **Blush Pink**: Accent (#f18a8a, #b03535)
- **Lavender**: Secondary (#ab94ea, #573698)

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Nunito (sans-serif)

### Accessibility
- WCAG 2.1 AA compliant
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text
- Keyboard navigation support
- Screen reader friendly

## 🧪 Testing

### Test Accounts
Create test accounts through the signup flow. All accounts are real and persist in the database.

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Login with existing account
- [ ] Forgot password flow
- [ ] Access protected routes when logged out (should redirect)
- [ ] Access protected routes when logged in (should work)
- [ ] Logout and verify session cleared
- [ ] Create journal entry (persists to database)
- [ ] View analytics and calendar
- [ ] Search therapists
- [ ] Browse community

## 📦 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Ensure all environment variables are set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ANTHROPIC_API_KEY`

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Supabase (already configured)
- **Database**: Supabase PostgreSQL (already configured)

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists in project root
- Verify variable names match exactly
- Restart dev server after adding variables

### "Failed to sign in"
- Verify Supabase project is active
- Check credentials are correct
- Ensure database tables are created
- Check Supabase dashboard for error logs

### "Session expired"
- Normal behavior after 1 hour
- User will be redirected to login
- Session automatically refreshes when active

### Protected routes not working
- Verify user is logged in
- Check browser console for errors
- Clear browser cache and cookies
- Check Supabase Auth dashboard

## 📚 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI**: Anthropic Claude 3.5 Sonnet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6

## 🤝 Support

For issues or questions:
1. Check this README
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment variables are set correctly

## 📄 License

MIT License - feel free to use for personal or commercial projects.
