# Auto Send Resume - Contact Form with Supabase Authentication

A modern Next.js application with secure Supabase authentication and a beautiful contact form.

## 🚀 Features

- **🔐 Supabase Authentication**: Complete auth system with login, signup, and password reset
- **📊 Dynamic Resume Management**: Resume types are managed through the resumes table
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🛡️ Secure**: JWT-based authentication with proper session management
- **⚡ Real-time**: Automatic auth state synchronization
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS
- **📧 Email Integration**: Automatic email sending with resume attachments

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd auto-send-resume
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**:

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Database Tables**:

   - Run the migration files in `app/db/migrations/` in order:
     - `20250615_create_submissions_table.sql` - Creates the submissions table
     - `20250116_create_resumes_table.sql` - Creates the resumes table for resume types
   - The resumes table will be populated with default resume types

3. **Configure Authentication**:
   - In your Supabase dashboard, go to Authentication → Settings
   - Configure your site URL (e.g., `http://localhost:3000` for development)
   - Enable email authentication
   - Optionally configure email templates

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important**: Replace the values with your actual Supabase project credentials:

- Get your project URL from your Supabase dashboard (Settings → API)
- Get your anon/public key from the same location
- The URL should look like: `https://abcdefghijk.supabase.co`

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Authentication Features

- **Sign In**: Existing users can log in with email/password
- **Sign Up**: New users can create accounts
- **Password Reset**: Users can reset forgotten passwords
- **Session Persistence**: Users stay logged in across browser sessions
- **Auto Logout**: Handles expired sessions gracefully

## 📱 User Experience

1. **Landing Page**: Users see the authentication form
2. **Registration**: New users can create accounts with email verification
3. **Login**: Existing users sign in and access the contact form
4. **Contact Form**: Authenticated users can submit contact information with dynamic resume type selection
5. **Submissions View**: Users can view all their past submissions
6. **Resume Management**: Resume types are dynamically loaded from the database
7. **Logout**: Users can securely log out

## 📊 Resume Management (resumes Table)

The application uses a "resumes" table to manage different types of resumes:

- **Dynamic Dropdown**: Resume types in the form are loaded from the database
- **Links Management**: Each resume type has an associated link (e.g., Google Drive)
- **API Endpoints**: Full CRUD operations available at `/api/resumes`
- **Display Names**: User-friendly names for each resume type
- **Active Status**: Resume types can be enabled/disabled

## 🛡️ Security Features

- JWT-based authentication via Supabase
- Secure session management
- Email verification for new accounts
- Password reset functionality
- Protected routes and API endpoints

## 🎨 Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)

## 📝 Environment Variables

| Variable                        | Description                 | Required |
| ------------------------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      |

## 🚀 Deployment

1. **Vercel** (Recommended):

   ```bash
   npm run build
   # Deploy to Vercel and add environment variables
   ```

2. **Other Platforms**:
   - Build the project: `npm run build`
   - Set the environment variables
   - Deploy the `out` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
