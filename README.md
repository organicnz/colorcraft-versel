# ColorCraft - Furniture Restoration Portfolio

## **Latest Updates**

✅ **Portfolio Load More Fixed** - Connected to real database with proper pagination
✅ **Navbar Optimization** - Clean circular profile button for logged users
✅ **Performance Optimizations** - Advanced caching, lazy loading, bundle optimization
✅ **Repository Organization** - Moved all docs to `docs/` and SQL files to `sql/` directories

## **Key Features**

- 🎨 Modern portfolio showcase with real-time database integration
- 🔐 Supabase authentication with role-based access
- 📱 Responsive design with Tailwind CSS
- ⚡ Optimized performance with Next.js 15 App Router
- 🛠️ Advanced admin dashboard for content management
- 📊 Analytics and monitoring integration

## **Quick Start**

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Resend keys

# Run development server
npm run dev

# Build for production
npm run build
```

## **Documentation**

📚 **Comprehensive documentation is available in the `docs/` directory:**

- **[Setup Guide](docs/setup/)** - Complete installation and configuration
- **[Development Guide](docs/development/)** - Development workflow and best practices
- **[Color System Guide](docs/colors/)** - Design system and theming
- **[Performance Guide](docs/performance/)** - Optimization strategies
- **[Troubleshooting](docs/troubleshooting/)** - Common issues and solutions
- **[Migration Guides](docs/)** - Database and feature migrations

🗄️ **SQL scripts and migrations are in the `sql/` directory:**

- **[Migration Scripts](sql/migrations/)** - Database schema updates
- **[Utilities](sql/utilities/)** - Helper scripts and functions
- **[Scripts](sql/scripts/)** - Automation and maintenance scripts

## **Deployment Status**

- **Repository**: [colorcraft-versel](https://github.com/organicnz/colorcraft-versel)
- **Framework**: Next.js 15 with Turbopack
- **Hosting**: Vercel (auto-deploy from main branch)
- **Database**: Supabase PostgreSQL
- **Region**: IAD1 (Washington, D.C.)

## **Development Rules**

### **Commit Standards**
```bash
# ALWAYS use our auto-commit script
npm run commit "description of changes" "Type"

# Example:
npm run commit "fix portfolio pagination" "Fix"
```

**Commit Types**: `Feat` | `Fix` | `Docs` | `Refactor` | `Style` | `Test` | `Chore`

### **Deployment Workflow**
1. ✅ Make changes and test locally
2. ✅ Use auto-commit script for consistent messaging  
3. ✅ Push triggers auto-deployment to Vercel
4. ✅ Check Vercel build logs if deployment fails
5. ✅ Monitor production for any issues

### **Code Quality**
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Component-based architecture
- Performance monitoring built-in

### **Database Management**
- Supabase PostgreSQL with Row Level Security
- Real-time subscriptions for live updates
- Automated migrations with version control
- Backup and restore procedures documented

---

**Last Updated**: Repository organization completed - all docs moved to `docs/` and SQL to `sql/`
**Status**: ✅ Production Ready

### To fix
- The 404 error page is still caught in an infinite reload loop. Take a more aggressive and systematic approach to isolate and fix it. Take a deep dive into the codebase and the error logs.
- So, was it beter to use js script rather than sh according to our next js libraries for the leanter etc?
- The dark and lihgt modes are not working as expected when I click the button for some reason.
- When I press edit to any portfolio item, it tries to take me to the edit page, but the page is loading 404 - Page Not Found.
- Errors in Versel build logs.
- The hero image on the main page with the elements inside of it is not working as expected. The element is moved to the left bottom of the image card.