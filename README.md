# Furniture Painter Website

A professional website for a furniture painter business with a portfolio section and integrated CRM system. Built with Next.js, Supabase, TailwindCSS, and Shadcn UI.

## Features

- 🎨 Beautiful design with warm wood-toned color palette
- 💼 Complete CRM for managing customers, projects, and inquiries
- 📷 Portfolio showcase with before/after images
- 🔒 Admin dashboard with content management
- 📱 Fully responsive across all devices
- 📧 Email notifications via Resend

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database & Auth:** Supabase
- **Styling:** TailwindCSS
- **Components:** Shadcn UI
- **Form Handling:** React Hook Form + Zod
- **State Management:** Zustand
- **Email Service:** Resend
- **File Uploads:** Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18.17+ 
- pnpm (recommended) or npm/yarn
- Supabase account
- Resend account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/furniture-painter.git
   cd furniture-painter
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Resend (for email notifications)
   RESEND_API_KEY=your_resend_api_key

   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Database Setup

Run the SQL scripts in the `supabase/schema.sql` file in your Supabase SQL editor to set up the required tables and relationships.

## Deployment

The project is configured for easy deployment on Vercel.

1. Push your code to GitHub
2. Connect the repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy!

## License

[MIT](LICENSE)
