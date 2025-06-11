# ColorCraft - Furniture Restoration Portfolio

## **Latest Updates**

✅ **Portfolio Load More Fixed** - Connected to real database with proper pagination
✅ **Navbar Optimization** - Clean circular profile button for logged users
✅ **Performance Optimizations** - Advanced caching, lazy loading, bundle optimization

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

**Last Updated**: Portfolio pagination fixed and connected to real database
**Status**: ✅ Production Ready