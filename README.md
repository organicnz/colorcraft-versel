# Color & Craft - Furniture Painting & Restoration

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
   git clone https://github.com/yourusername/color-craft.git
   cd color-craft
   ```

2. Install dependencies:
   ```