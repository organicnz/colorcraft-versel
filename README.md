# Color & Craft - Furniture Painting & Restoration

A complete business solution for custom furniture painting and restoration services. This Next.js application combines a beautiful client-facing website with powerful admin tools for customer relationship management.

## 🎨 Features

### **Beautiful Client-Facing Website**
- ✨ Showcase portfolio of completed projects with glassmorphism effects
- 📋 Service information and pricing
- 📞 Contact form for inquiries
- 💬 Customer testimonials with beautiful UI
- 📖 About page with company story
- 🎭 Advanced parallax scrolling effects

### **Customer Portal**
- 📊 View project status and progress
- 💬 Message the craftsperson
- 🧾 View and pay invoices
- 📝 Request quotes for new work

### **Admin Dashboard**
- 👥 Customer relationship management (CRM)
- 📈 Project tracking and management
- 🖼️ Portfolio management with image sync
- ✏️ Content management for website
- 📊 Analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with Server and Client Components
- **Styling**: Tailwind CSS 4 with glassmorphism design system
- **Animations**: Framer Motion for advanced parallax effects
- **State Management**: 
  - Zustand for global UI state
  - React Query for server state and data fetching
- **Forms**: React Hook Form with Zod validation
- **Image Uploads**: UploadThing for seamless file uploads
- **Components**: Custom UI components with Radix UI primitives

### Backend
- **Database**: PostgreSQL via Supabase with JSONB optimization
- **Authentication**: Supabase Auth with SSR support
- **Storage**: Supabase Storage with automated image management
- **Email**: Resend API for transactional emails
- **API**: Next.js API routes with TypeScript

### Development Tools
- **Language**: TypeScript for complete type safety
- **Package Manager**: pnpm for efficient dependency management
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier with Tailwind plugin
- **Database**: Drizzle ORM with migrations

### Infrastructure
- **Hosting**: Vercel for production deployment
- **Database**: Supabase cloud with edge functions
- **CI/CD**: Vercel GitHub integration
- **Environment**: Strict env variable management

## 📚 Documentation

### 🚀 Setup & Configuration
- [Authentication Setup](docs/setup/AUTHENTICATION.md) - Complete authentication configuration
- [Environment Variables](docs/setup/ENV-GUIDE.md) - Environment setup and configuration
- [Email Configuration](docs/setup/EMAIL-GUIDE.md) - Resend email service setup
- [Vercel Environment Setup](docs/setup/VERCEL_ENV_SETUP.md) - Production environment configuration
- [Deployment Guide](docs/setup/DEPLOYMENT.md) - Complete deployment instructions
- [Webhook Setup](docs/setup/WEBHOOK_SETUP_GUIDE.md) - Supabase webhook configuration

### 🔧 Development
- [Database Schema](docs/development/DATABASE-SCHEMA-SUMMARY.md) - Complete database structure
- [Portfolio Fix Summary](docs/development/PORTFOLIO-FIX-SUMMARY.md) - Portfolio system improvements
- [Portfolio Status Migration](docs/development/PORTFOLIO-STATUS-MIGRATION.md) - Migration documentation
- [Portfolio Sync Comparison](docs/development/PORTFOLIO-SYNC-COMPARISON.md) - Sync system analysis

### 🐛 Troubleshooting
- [Deployment Logs](docs/troubleshooting/DEPLOYMENT-LOGS.md) - Common deployment issues
- [Vercel Log Monitoring](docs/troubleshooting/VERCEL_LOG_MONITORING.md) - Production monitoring

### 📁 SQL Documentation
- [SQL Files Organization](sql/README.md) - Complete SQL files structure and usage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Resend account (for email notifications)
- Vercel account (for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/organicnz/colorcraft-versel.git
   cd colorcraft
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```
   
   See [Environment Setup Guide](docs/setup/ENV-GUIDE.md) for detailed configuration.

4. **Set up the database:**
   ```bash
   # Run Supabase migrations
   npx supabase db push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

6. **Visit the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Admin dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 🎯 Key Features Implemented

### ✨ Glassmorphism Design System
- Beautiful glass-like UI components throughout
- Consistent design language with backdrop-blur effects
- Dark mode compatibility

### 🎭 Advanced Parallax Effects
- Multi-layered background animations
- RealVantage-inspired smooth scrolling
- Performance-optimized transforms

### 📸 Portfolio Management
- Automated image synchronization
- JSONB-optimized data storage
- Admin tools for content management

### 🔄 Real-time Updates
- Supabase real-time subscriptions
- Instant portfolio updates
- Live project status tracking

## 📝 Scripts

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

### Database
```bash
pnpm db:generate  # Generate database schema
pnpm db:push      # Push schema changes
pnpm db:studio    # Open database studio
```

### Deployment
```bash
pnpm commit "message" "Type"  # Automated commit with standards
npx vercel deploy            # Deploy to Vercel
```

## 🌐 Live Demo

- **Production**: [https://colorcraft-versel.vercel.app](https://colorcraft-versel.vercel.app)
- **Staging**: [Available on Vercel preview deployments]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `pnpm commit "add amazing feature" "Feat"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library
- [Vercel](https://vercel.com/) - Platform for frontend frameworks

---

*Built with ❤️ for beautiful furniture transformations*

**Last Updated**: June 10, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready

<!-- Deployment trigger: 2025-01-10 -->