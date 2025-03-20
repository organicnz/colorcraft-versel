# ColorCraft - Furniture Painting & Restoration

A complete business solution for custom furniture painting and restoration services. This Next.js application combines a beautiful client-facing website with powerful admin tools for customer relationship management.

## Features

- **Beautiful Client-Facing Website**
  - Showcase portfolio of completed projects
  - Service information and pricing
  - Contact form for inquiries
  - Customer testimonials
  - About page with company story

- **Customer Portal**
  - View project status
  - Message the craftsperson
  - View and pay invoices
  - Request quotes for new work

- **Admin Dashboard**
  - Customer relationship management (CRM)
  - Project tracking and management
  - Portfolio management
  - Content management for website
  - Analytics and reporting

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with Server and Client Components
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: 
  - Zustand for global UI state
  - React Query for server state and data fetching
- **Forms**: React Hook Form with Zod validation
- **Image Uploads**: UploadThing for seamless file uploads
- **Date Handling**: date-fns for date formatting and manipulation
- **Components**: Mix of custom UI components and Radix UI primitives

### Backend
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with SSR support
- **Storage**: Supabase Storage for project images
- **Email**: Resend API for transactional emails
- **Analytics**: Vercel Analytics for visitor tracking
- **API**: Next.js API routes with strong typing

### Development Tools
- **Language**: TypeScript for type safety
- **Package Manager**: pnpm for efficient dependency management
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier with tailwind plugin
- **Versioning**: Git with conventional commits
- **Testing**: Jest (planned)

### Infrastructure
- **Hosting**: Vercel for production deployment
- **Database Hosting**: Supabase cloud
- **CI/CD**: Vercel GitHub integration
- **Environment**: Strict separation of dev/prod environments

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Resend account (for email notifications)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/colorcraft.git
   cd colorcraft
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Resend (for email notifications)
   RESEND_API_KEY=your-resend-api-key

   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Set up Supabase database:
   - Navigate to your Supabase project dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the query to set up the database schema

5. Start the development server:
   ```
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following database tables:

1. **users** - User accounts (extends Supabase auth.users)
   - Customer accounts
   - Admin accounts

2. **projects** - Portfolio projects 
   - Before/after images
   - Techniques and materials used
   - Client testimonials

3. **customers** - CRM information
   - Contact details
   - Notes
   - Relationship management

4. **services** - Services offered
   - Descriptions
   - Price ranges
   - Service images

5. **inquiries** - Customer inquiries/quotes
   - Service requested
   - Details about furniture
   - Budget and timeline

6. **client_projects** - Active client projects
   - Project status and progress
   - Payment tracking
   - Project timeline

7. **site_content** - Website content
   - Editable content for website pages
   - Company information
   - FAQ and policies

## Deployment

This application is designed to be deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Resend](https://resend.io/)
- [Vercel Analytics](https://vercel.com/analytics)
