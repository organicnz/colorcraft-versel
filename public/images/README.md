# 📸 ColorCraft Media Assets

This directory contains all media assets for the ColorCraft furniture painting website, organized by purpose and usage.

## 📁 Directory Structure

### 🎨 Branding (`/branding/`)
Brand assets including logos and corporate identity materials:

- `logo.png` - Main ColorCraft logo (760KB)
- `logo-origami.png` - Alternative origami-style logo variant (29KB)

**Usage**: Use for headers, footers, business cards, and brand identity.

### 🏠 Portfolio (`/portfolio/`)
Showcase images of completed furniture painting projects:

- Contains before/after photos of furniture transformations
- Organized by project or furniture type
- Used in portfolio galleries and project showcases

### 👥 Team (`/team/`)
Team member photos and related imagery:

- Staff photos for about page
- Team event photos
- Professional headshots

### 💬 Testimonials (`/testimonials/`)
Customer testimonial related imagery:

- Customer photos (with permission)
- Before/after comparison images
- Review screenshots

### 📖 About (`/about/`)
About page and company story imagery:

- Workshop photos
- Company history images
- Process documentation photos

### 🏛️ Hero Images
Large background images for website sections:

- `hero-furniture.png` - Furniture showcase hero (1.2MB)
- `hero-house.png` - House interior hero (2.9MB)  
- `hero-kitchen.png` - Kitchen transformation hero (2.6MB)

### 🎯 Miscellaneous (`/misc/`)
Other images and assets:

- `bird_2.jpg` - Decorative image (682KB)
- Temporary or testing images
- Utility graphics

### 🧪 Abstract/Design Elements
- `logo-abstract.jpg` - Abstract design elements (2.2MB)
- `logo-abstract-small.jpg` - Optimized version (22KB)
- `logo-abstract-original.jpg` - Original high-res version (2.2MB)

## 📏 Image Guidelines

### Optimization Standards
- **Hero Images**: Max 3MB, WebP preferred for modern browsers
- **Portfolio Images**: Max 1MB per image, optimize for web
- **Logos**: SVG preferred, PNG fallback with transparent background
- **Thumbnails**: Max 100KB for grid displays

### Naming Conventions
- Use kebab-case: `hero-kitchen.png`
- Include descriptive names: `testimonial-kitchen-before.jpg`
- Add size indicators when needed: `logo-small.png`
- Use project codes for portfolio: `project-001-before.jpg`

### File Formats
- **Logos**: SVG (vector) > PNG (raster)
- **Photos**: WebP > JPEG > PNG
- **Graphics**: SVG > PNG
- **Icons**: SVG preferred

## 🔧 Usage in Code

### Import Examples
```tsx
// Hero images
import heroFurniture from '/images/hero-furniture.png'

// Branding
import logo from '/images/branding/logo.png'

// Portfolio
import portfolioImage from '/images/portfolio/project-001-after.jpg'
```

### Next.js Image Component
```tsx
import Image from 'next/image'

<Image
  src="/images/branding/logo.png"
  alt="ColorCraft Logo"
  width={200}
  height={100}
  priority // For above-the-fold images
/>
```

## 🎯 Best Practices

1. **Always optimize images** before adding to repository
2. **Use descriptive alt text** for accessibility
3. **Consider lazy loading** for below-the-fold content
4. **Provide multiple resolutions** for responsive design
5. **Use Next.js Image component** for automatic optimization

## 📊 Asset Inventory

| Directory | File Count | Total Size | Primary Use |
|-----------|------------|------------|-------------|
| Branding | 2 files | ~790KB | Logo, brand identity |
| Portfolio | ~25 files | ~15MB | Project showcases |
| Team | ~7 files | ~2MB | About page, staff |
| Testimonials | ~3 files | ~600KB | Customer reviews |
| About | ~2 files | ~500KB | Company story |
| Hero | 3 files | ~6.8MB | Page backgrounds |
| Misc | 1 file | ~682KB | Various purposes |

---

**Last Updated**: June 10, 2025  
**Maintainer**: Development Team  
**Total Assets**: ~40 files, ~25MB 