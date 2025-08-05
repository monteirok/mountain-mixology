# Mountain Mixology - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your API keys (optional for basic testing)
# For full functionality, add:
# - HUBSPOT_API_KEY (for CRM integration)
# - STRIPE_SECRET_KEY (for payments)
# - GOOGLE_CLIENT_ID (for calendar)
# - GMAIL_USER (for email automation)
# - SLACK_BOT_TOKEN (for notifications)
```

### 3. Start Development Servers

**Option A: Start All Servers (Recommended)**
```bash
# Terminal 1: Start Express Backend
npm run server:dev

# Terminal 2: Start Next.js Frontend  
npm run dev

# Terminal 3: Start MCP Servers (optional, for full automation)
npm run mcp:dev
```

**Option B: Quick Development Setup**
```bash
# Start both frontend and backend together
npm run server:dev & npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3000/admin

## 🔧 How It Works

### Architecture Overview
```
Frontend (Next.js:3000) → API Proxy → Express Backend (3001) → MCP Servers
                                    ↓
                                 Database/External APIs
```

### API Flow
1. **Contact Form Submission**:
   - Frontend submits to `/api/contact`
   - Next.js API route proxies to Express backend at `localhost:3001/api/contact`
   - Express backend triggers MCP workflow automation
   - Response sent back through proxy to frontend

2. **Admin Dashboard**:
   - Accesses contact data via same proxy system
   - Real-time MCP server status monitoring
   - Manual workflow trigger capabilities

### Key Features
- ✅ **Contact Form**: Fully functional with validation
- ✅ **Lead Scoring**: Automatic qualification based on budget/event type
- ✅ **Email Automation**: Welcome emails and follow-up sequences (when configured)
- ✅ **CRM Integration**: HubSpot sync (when API key provided)
- ✅ **Calendar Management**: Google Calendar integration (when configured)
- ✅ **Payment Processing**: Stripe integration (when API key provided)
- ✅ **Admin Dashboard**: Real-time monitoring and management

## 🧪 Testing the Setup

### 1. Test Contact Form
1. Go to http://localhost:3000
2. Scroll to contact form
3. Fill out form with test data
4. Submit - should see success message

### 2. Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Should see submitted contact in "Recent Inquiries"
3. Click "Trigger Workflow" to test MCP integration

### 3. Check Backend Logs
- Express backend logs will show API requests
- MCP workflow execution status
- Any integration errors (if API keys not configured)

## 🔑 External Service Configuration

### Required for Full Functionality
```bash
# .env file configuration
HUBSPOT_API_KEY=your_key_here          # CRM integration
STRIPE_SECRET_KEY=your_key_here        # Payment processing  
GOOGLE_CLIENT_ID=your_key_here         # Calendar integration
GMAIL_USER=your_email_here             # Email automation
SLACK_BOT_TOKEN=your_token_here        # Team notifications
```

### Without API Keys
The system works in "demo mode":
- Contact form submissions are stored in memory
- Email automation is simulated (logged to console)
- CRM integration is bypassed
- Payment processing is mocked
- Calendar integration uses mock data

## 🚀 Production Deployment

### 1. Build All Components
```bash
npm run build
npm run server:build
npm run mcp:build
```

### 2. Start Production Services
```bash
# Start Express backend
npm run server:start &

# Start MCP servers  
npm run mcp:start &

# Start Next.js frontend
npm run start
```

### 3. Environment Variables
Ensure all production environment variables are set:
- Database connection string
- External API keys
- Production domain settings

## ✅ Verification Checklist

- [ ] Both servers start without errors
- [ ] Contact form submits successfully  
- [ ] Admin dashboard loads contact data
- [ ] Backend logs show API requests
- [ ] MCP workflow triggers (even in demo mode)
- [ ] No console errors in browser

## 🔧 Troubleshooting

### "404 Not Found" on Form Submission
- Ensure Express backend is running on port 3001
- Check that API proxy routes exist in `app/api/`
- Verify CORS settings if needed

### MCP Workflow Errors
- Check environment variables are loaded
- Verify external API keys are valid
- Review backend logs for detailed error messages

### Permission Errors
```bash
# Fix .next directory permissions if needed
rm -rf .next
npm run build
```

## 📊 Expected Results

With this setup you should have:
- ✅ **Professional contact form** with instant response
- ✅ **Automated lead processing** with scoring
- ✅ **Admin dashboard** for management
- ✅ **Scalable architecture** ready for production
- ✅ **External service integration** (when configured)

The system transforms a basic contact form into a complete business automation platform that handles the entire customer journey from inquiry to conversion.