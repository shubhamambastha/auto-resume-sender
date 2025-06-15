# Auto Send Resume - Contact Form with Supabase Authentication

A modern Next.js application with secure Supabase authentication and a beautiful contact form.

## 🚀 Features

- **🔐 Supabase Authentication**: Complete auth system with login, signup, and password reset
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🛡️ Secure**: JWT-based authentication with proper session management
- **⚡ Real-time**: Automatic auth state synchronization
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS

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

2. **Configure Authentication**:
   - In your Supabase dashboard, go to Authentication → Settings
   - Configure your site URL (e.g., `http://localhost:3000` for development)
   - Enable email authentication
   - Optionally configure email templates

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project credentials.

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
4. **Contact Form**: Authenticated users can submit contact information
5. **Logout**: Users can securely log out

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
