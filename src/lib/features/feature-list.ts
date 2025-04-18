import { FeatureConfig } from './index';

/**
 * Feature flags for the Color & Craft application
 * 
 * Use these constants when checking feature flags in the application
 * @example
 * ```tsx
 * // In a client component
 * import { FEATURE_FLAGS } from '@/lib/features/feature-list';
 * import { useFeatureFlag } from '@/lib/features/useFeatureFlag';
 * 
 * function MyComponent() {
 *   const { enabled } = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);
 *   // Use the enabled value to conditionally render UI elements
 * }
 * 
 * // In a server component
 * import { isFeatureEnabled, getFeatureFlag } from '@/lib/features';
 * import { FEATURE_FLAGS } from '@/lib/features/feature-list';
 * 
 * async function ServerComponent({ userId }: { userId: string }) {
 *   const isNewUiEnabled = await getFeatureFlag(FEATURE_FLAGS.NEW_UI, { userId });
 *   // Use the isNewUiEnabled value to conditionally render UI elements
 * }
 * ```
 */
export const FEATURE_FLAGS: Record<string, FeatureConfig> = {
  // UI Features
  DARK_MODE: {
    name: 'dark_mode',
    defaultValue: true,
    environments: ['development', 'staging', 'production'],
    description: 'Enable dark mode theme option for the application',
  },
  NEW_UI: {
    name: 'new_ui',
    defaultValue: false,
    environments: ['development', 'staging'],
    description: 'Enable the new UI design system throughout the application',
  },
  
  // Portfolio Features
  PORTFOLIO_GALLERY: {
    name: 'portfolio_gallery',
    defaultValue: true,
    environments: ['development', 'staging', 'production'],
    description: 'Enable the enhanced portfolio gallery with filtering options',
  },
  PORTFOLIO_COMMENTS: {
    name: 'portfolio_comments',
    defaultValue: false,
    environments: ['development'],
    description: 'Allow customers to leave comments on portfolio items',
  },
  
  // CRM Features
  ADVANCED_CRM: {
    name: 'advanced_crm',
    defaultValue: false,
    environments: ['development', 'staging'],
    description: 'Enable advanced CRM features such as customer segmentation and reporting',
  },
  
  // Authentication Features
  SOCIAL_AUTH: {
    name: 'social_auth',
    defaultValue: false,
    environments: ['development'],
    description: 'Enable social authentication options (Google, Facebook)',
  },
  PASSWORDLESS_LOGIN: {
    name: 'passwordless_login',
    defaultValue: true,
    environments: ['development', 'staging', 'production'],
    description: 'Enable magic link (passwordless) authentication',
  },
  
  // Payment Features
  STRIPE_INTEGRATION: {
    name: 'stripe_integration',
    defaultValue: false,
    environments: ['development', 'staging'],
    description: 'Enable Stripe payment integration for services',
  },
  
  // Performance Features
  IMAGE_OPTIMIZATION: {
    name: 'image_optimization',
    defaultValue: true,
    environments: ['development', 'staging', 'production'],
    description: 'Enable advanced image optimization for portfolio images',
  },
  
  // Contact Features
  ENHANCED_CONTACT_FORM: {
    name: 'enhanced_contact_form',
    defaultValue: false,
    environments: ['development', 'staging'],
    description: 'Enable enhanced contact form with service selection and scheduling',
  },
};

export interface FeatureDefinition {
  name: string;
  description: string;
  defaultValue: boolean;
  category?: string;
}

export const Feature_definitions: FeatureDefinition[] = [
  {
    name: 'enable_portfolio_management',
    description: 'Enable the portfolio management features',
    defaultValue: true,
    category: 'dashboard',
  },
  {
    name: 'enable_services_management',
    description: 'Enable the services management features',
    defaultValue: true,
    category: 'dashboard',
  },
  {
    name: 'enable_user_management',
    description: 'Enable the user management features',
    defaultValue: true,
    category: 'admin',
  },
]; 