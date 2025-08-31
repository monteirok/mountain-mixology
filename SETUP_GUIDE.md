# Mountain Mixology Setup Guide

This guide will help you set up the Mountain Mixology application for development or production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- npm or yarn package manager

## 1. Environment Configuration

### Create `.env` file

Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

### Required Environment Variables

Edit your `.env` file and set these **required** variables:

```bash
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/mountain_mixology

# Session Secret (Required - generate a secure random string)
SESSION_SECRET=your_very_secure_random_string_at_least_32_characters_long

# Admin Authentication (Required)
ADMIN_EMAIL=admin@mountainmixology.com
```

**Important**: Do NOT set `ADMIN_PASSWORD` in your `.env` file. The bootstrap script will generate a secure password for you.

### Generate SESSION_SECRET

Generate a secure session secret using one of these methods:

```bash
# Method 1: OpenSSL (recommended)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online generator (use a trusted source)
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### Optional Environment Variables

These are needed for full functionality but not required for initial setup:

```bash
# External Service API Keys (Optional for development)
HUBSPOT_API_KEY=your_hubspot_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Google Services (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALENDAR_ID=your_google_calendar_id_here

# Email Services (Optional)
GMAIL_USER=your_gmail_address_here
GMAIL_APP_PASSWORD=your_gmail_app_password_here
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_LIST_ID=your_mailchimp_list_id_here

# Slack Integration (Optional)
SLACK_BOT_TOKEN=your_slack_bot_token_here
SLACK_CHANNEL_ID=your_slack_channel_id_here

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Express Backend URL (Optional)
EXPRESS_SERVER_URL=http://localhost:3001
```

## 2. Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE mountain_mixology;
```
3. Update `DATABASE_URL` in your `.env` file

### Option B: Hosted Database

Use a service like:
- **Neon** (recommended for development): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com

Copy the connection string to your `DATABASE_URL` in `.env`.

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Admin User

Run the secure admin bootstrap script:

```bash
npm run bootstrap:admin
```

This will:
- Generate a cryptographically secure password
- Hash the password with bcrypt
- Create the admin user in your database
- Display the generated password (save it securely!)

**⚠️ Important**: Save the generated password immediately - it won't be shown again!

## 5. Database Schema

Set up your database schema:

```bash
npm run db:push
```

## 6. Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

Start the Express backend server (in another terminal):

```bash
npm run server:dev
```

## 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:3000/admin

## Troubleshooting

### Bootstrap Script Issues

**Error: Missing environment variables**
- Ensure your `.env` file exists and has the required variables set
- Check that your `.env` file is in the project root directory

**Error: Database connection failed**
- Verify your `DATABASE_URL` is correct
- Ensure your database is running and accessible
- Check firewall settings for hosted databases

**Error: bcrypt module not found**
- Run `npm install` to ensure all dependencies are installed

### Development Issues

**Port 3000/3001 already in use**
- Check if other applications are using these ports
- Kill existing processes: `lsof -ti:3000 | xargs kill -9`

**TypeScript errors**
- Run `npm run check` to see all TypeScript issues
- Most strict mode errors are non-critical for development

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords for all services
- Regularly rotate API keys and secrets
- Enable 2FA on all external services
- Monitor your application logs for security issues

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Ensure all required production environment variables are set
3. Use proper SSL certificates
4. Set up proper database backups
5. Configure monitoring and logging
6. Follow the security guidelines in `SECURITY.md`

## Need Help?

- Check the `TROUBLESHOOTING.md` file (if available)
- Review the security documentation in `SECURITY.md`
- Open an issue in the GitHub repository
- Contact: admin@mountainmixology.com

---

**Next Steps**: Once you've completed the setup, you can start developing or deploy to production!