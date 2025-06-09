export type UserRole = 'admin' | 'customer'

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled'

export type ClientProject = {
  id: string
  customer_id: string
  inquiry_id: string | null
  title: string
  description: string | null
  status: ProjectStatus
  start_date: string | null
  deadline: string | null
  completion_date: string | null
  price: number | null
  deposit_amount: number | null
  deposit_paid: boolean
  final_paid: boolean
  progress_images: string[]
  progress_notes: string[]
  created_at: string
  updated_at: string
}

export type InquiryStatus = 'pending' | 'quoted' | 'accepted' | 'declined' | 'completed'

export type Inquiry = {
  id: string
  customer_id: string | null
  service_id: string | null
  status: InquiryStatus
  description: string
  furniture_type: string
  furniture_dimensions: string | null
  furniture_images: string[]
  preferred_timeline: string | null
  budget_range: string | null
  created_at: string
  updated_at: string
}

export type Customer = {
  id: string
  user_id: string | null
  full_name: string
  email: string
  phone: string | null
  address: string | null
  notes: string | null
  customer_since: string
  created_at: string
  updated_at: string
}

export type Service = {
  id: string
  name: string
  description: string
  brief_description: string
  image_url: string | null
  price_range: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type PortfolioStatus = 'published' | 'draft' | 'archived'

export type PortfolioProject = {
  id: string
  title: string
  description: string | null
  brief_description: string
  before_images: string[]
  after_images: string[]
  techniques: string[] | null
  materials: string[] | null
  completion_date: string | null
  client_name: string | null
  client_testimonial: string | null
  is_featured: boolean
  status: PortfolioStatus
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export type SiteContent = {
  id: string
  title: string
  content: {
    text: string
  }
  created_at: string
  updated_at: string
} 