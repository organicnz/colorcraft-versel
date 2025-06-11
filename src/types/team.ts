export interface TeamMember {
  id: string;
  user_id?: string | null;
  full_name: string;
  position: string;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  years_experience?: number | null;
  specialties?: string[] | null;
  social_links?: SocialLinks | null;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  portfolio?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface CreateTeamMemberData {
  user_id?: string | null;
  full_name: string;
  position: string;
  bio?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  years_experience?: number;
  specialties?: string[];
  social_links?: SocialLinks;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {
  id: string;
}

export interface TeamFilters {
  is_featured?: boolean;
  is_active?: boolean;
  position?: string;
}

export interface TeamSortOptions {
  field: 'display_order' | 'full_name' | 'position' | 'created_at';
  direction: 'asc' | 'desc';
} 