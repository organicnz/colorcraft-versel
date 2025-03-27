# Color & Craft CRM Module

This module provides Customer Relationship Management capabilities for the Color & Craft furniture painting business.

## Features

- **Customer Management**: Track customer details, status, and communication history
- **Lead Management**: Capture and track potential customer leads
- **Project Management**: Manage furniture painting projects from inquiry to completion
- **Communication Tracking**: Record all communications with customers and leads
- **Dashboard**: Get an overview of your CRM data with key metrics

## Database Setup

The CRM module uses Supabase as its database. To set up the required tables:

1. Navigate to your Supabase project
2. Run the SQL migration file located at: `supabase/migrations/20240101000000_crm_tables.sql`

## Routes

- `/crm` - Main CRM dashboard with overview statistics
- `/crm/customers` - List and manage customers
- `/crm/customers/new` - Add a new customer
- `/crm/customers/[id]` - View customer details
- `/crm/customers/[id]/edit` - Edit customer details
- `/crm/leads` - List and manage leads
- `/crm/leads/new` - Add a new lead
- `/crm/leads/[id]` - View lead details
- `/crm/leads/[id]/edit` - Edit lead details
- `/crm/projects` - List and manage projects
- `/crm/projects/new` - Add a new project
- `/crm/projects/[id]` - View project details
- `/crm/projects/[id]/edit` - Edit project details

## Usage Guide

### Customers

The Customers section allows you to:
- View all customers in a sortable table
- Add new customers
- Edit existing customer details
- View communication history with each customer
- Track customer projects

### Leads

The Leads section helps you:
- Capture potential customers
- Track lead status (new, contacted, qualified, etc.)
- Convert qualified leads to customers
- Record all communications with leads

### Projects

The Projects section enables you to:
- Create new furniture painting projects
- Track project status
- Manage project details like estimated value, timelines
- Associate projects with customers
- Record communications related to specific projects

## Integration with Existing Systems

This CRM module integrates with other parts of the Color & Craft application:

- Uses the same Supabase authentication system
- Shares user data with the main application
- Can send emails through the existing Resend integration

## Row-Level Security

All CRM data is protected by Supabase Row-Level Security (RLS) policies that ensure:
- Users can only see their own customers, leads, and projects
- Admins have additional access rights
- Data is securely compartmentalized 