# Color System Guide

This document provides a comprehensive guide to the ColorCraft color system, covering the core palette, theme implementation, and best practices for maintaining consistent design across light and dark modes.

## Core Color Palette

### Primary Colors - Warm Wood Tones
The primary color family uses warm, sophisticated wood tones that reflect the craftsmanship theme:

```css
primary-50: #FBF7F4   /* Very light wood */
primary-100: #F6EEE8  /* Light wood */
primary-200: #EEDCCB  /* Pale wood */
primary-300: #E5C9AE  /* Light brown */
primary-400: #DCB690  /* Medium wood */
primary-500: #D3A273  /* Main brand color */
primary-600: #C08A5A  /* Rich wood */
primary-700: #A47245  /* Dark wood */
primary-800: #7D5734  /* Very dark wood */
primary-900: #573C24  /* Darkest wood */
```

### Secondary Colors - Sophisticated Teals
Complementary teal colors that provide modern, fresh contrast:

```css
secondary-50: #EDFAF8   /* Very light teal */
secondary-100: #D5F2ED  /* Light teal */
secondary-200: #B0E5DC  /* Pale teal */
secondary-300: #8AD7CB  /* Light cyan */
secondary-400: #65C9BA  /* Medium teal */
secondary-500: #40BAA9  /* Main secondary color */
secondary-600: #339588  /* Rich teal */
secondary-700: #297A70  /* Dark teal */
secondary-800: #1F5F58  /* Very dark teal */
secondary-900: #143F3A  /* Darkest teal */
```

### Accent Colors - Soft Blush Tones
Warm accent colors for highlights and special elements:

```css
accent-50: #FDF2F4    /* Very light blush */
accent-100: #FAE5E9   /* Light blush */
accent-200: #F5CAD3   /* Pale blush */
accent-300: #F0B0BD   /* Light pink */
accent-400: #EB95A7   /* Medium blush */
accent-500: #E67A91   /* Main accent color */
accent-600: #D35675   /* Rich blush */
accent-700: #BA3D5D   /* Dark blush */
accent-800: #8E2E47   /* Very dark blush */
accent-900: #621F31   /* Darkest blush */
```

### Neutral Colors - Warmer Grays
Custom neutral tones that complement the warm color palette:

```css
neutral-50: #F9F9F7    /* Very light neutral */
neutral-100: #F1F1EE   /* Light neutral */
neutral-200: #E4E4DE   /* Pale neutral */
neutral-300: #D7D6CE   /* Light gray */
neutral-400: #ACABA1   /* Medium gray */
neutral-500: #87867C   /* Main neutral */
neutral-600: #65645C   /* Rich gray */
neutral-700: #4A4942   /* Dark gray */
neutral-800: #2E2D29   /* Very dark gray */
neutral-900: #1A1A17   /* Darkest gray */
```

### Semantic Colors
Complete color scales for status indication:

#### Success Colors
```css
success-50: #DCFCE7    /* Very light green */
success-100: #BBF7D0   /* Light green */
success-200: #86EFAC   /* Pale green */
success-300: #4ADE80   /* Light success */
success-400: #22C55E   /* Medium green */
success-500: #16A34A   /* Main success */
success-600: #15803D   /* Rich green */
success-700: #166534   /* Dark green */
success-800: #14532D   /* Very dark green */
success-900: #052E16   /* Darkest green */
```

#### Warning Colors
```css
warning-50: #FEF9C3    /* Very light yellow */
warning-100: #FEF3C7   /* Light yellow */
warning-200: #FDE68A   /* Pale yellow */
warning-300: #FCD34D   /* Light warning */
warning-400: #FBBF24   /* Medium yellow */
warning-500: #EAB308   /* Main warning */
warning-600: #D97706   /* Rich orange */
warning-700: #B45309   /* Dark orange */
warning-800: #92400E   /* Very dark orange */
warning-900: #78350F   /* Darkest orange */
```

#### Danger Colors
```css
danger-50: #FEE2E2     /* Very light red */
danger-100: #FECACA    /* Light red */
danger-200: #FCA5A5    /* Pale red */
danger-300: #F87171    /* Light danger */
danger-400: #EF4444    /* Medium red */
danger-500: #DC2626    /* Main danger */
danger-600: #B91C1C    /* Rich red */
danger-700: #991B1B    /* Dark red */
danger-800: #7F1D1D    /* Very dark red */
danger-900: #450A0A    /* Darkest red */
```

## Theme Implementation

### CSS Variables
The system uses CSS variables in `globals.css` for dynamic theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 210 20% 98%;
  /* ... additional variables */
}

.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  --primary: 210 20% 98%;
  --primary-foreground: 220.9 39.3% 11%;
  /* ... additional variables */
}
```

### Tailwind Configuration
Colors are integrated into Tailwind CSS through `tailwind.config.ts`:

```typescript
import { colors as customColors } from './src/styles/colors'

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: customColors.primary[50],
          100: customColors.primary[100],
          // ... all shades
          500: customColors.primary[500], // Main brand color
          // ... continuing through 900
        },
        // ... secondary, accent, neutral, semantic colors
      }
    }
  }
}
```

## Usage Patterns

### Component Usage

#### Correct: Theme-Aware Classes
```tsx
// ✅ Good - adapts to dark mode
<button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white">
  Primary Button
</button>

// ✅ Good - uses semantic classes
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
  Content
</div>
```

#### Incorrect: Static Colors
```tsx
// ❌ Bad - doesn't adapt to dark mode
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Button
</button>

// ❌ Bad - hardcoded colors
<div className="bg-[#D3A273] text-[#573C24]">
  Content
</div>
```

### Utility Functions
Use the color utility functions from `src/lib/utils/colors.ts`:

```typescript
import { getThemeClasses, createThemeStyles, getThemeColor } from '@/lib/utils/colors'

// Get theme-aware Tailwind classes
const buttonClasses = getThemeClasses('button', 'primary', 'px-4 py-2 rounded')

// Generate CSS-in-JS styles
const cardStyles = createThemeStyles('card', 'default', isDark)

// Get specific color values
const primaryColor = getThemeColor('primary', 500, isDark)
```

### Status Colors
Use semantic colors appropriately:

```tsx
// Success state
<div className="bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-100 border border-success-200 dark:border-success-700">
  Success message
</div>

// Warning state
<div className="bg-warning-50 dark:bg-warning-900 text-warning-700 dark:text-warning-100 border border-warning-200 dark:border-warning-700">
  Warning message
</div>

// Danger state
<div className="bg-danger-50 dark:bg-danger-900 text-danger-700 dark:text-danger-100 border border-danger-200 dark:border-danger-700">
  Error message
</div>
```

## Best Practices

### 1. Always Use Theme-Aware Classes
- Always provide both light and dark variants: `bg-white dark:bg-neutral-800`
- Use semantic color names over hardcoded values
- Test components in both light and dark modes

### 2. Maintain Color Hierarchy
- Lighter shades (50-200): Backgrounds and subtle elements
- Medium shades (400-600): UI elements and primary actions
- Darker shades (700-900): Text and high-contrast elements

### 3. Accessibility Considerations
All color combinations meet WCAG AA contrast ratios:
- Text on light backgrounds: Use 700+ shades
- Text on dark backgrounds: Use 100-300 shades
- Interactive elements: Ensure sufficient contrast for focus states

### 4. Consistent Usage
- **Primary**: Main CTAs, navigation, brand elements
- **Secondary**: Supporting actions, complementary elements
- **Accent**: Highlights, special features, emphasis
- **Neutral**: Text, borders, backgrounds
- **Semantic**: Status indicators only

### Common Pitfalls

#### ❌ Avoid These Patterns:
```tsx
// Missing dark mode variant
<div className="bg-white text-black">

// Using hardcoded colors
<div className="bg-[#D3A273]">

// Wrong semantic usage
<button className="bg-success-500">Delete</button> // Should be danger

// Insufficient contrast
<span className="text-neutral-400">Important text</span> // Too light
```

#### ✅ Use These Instead:
```tsx
// Complete theme support
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">

// Semantic color usage
<div className="bg-primary-500 dark:bg-primary-600">

// Proper semantic usage
<button className="bg-danger-500 hover:bg-danger-600">Delete</button>

// Good contrast
<span className="text-neutral-700 dark:text-neutral-300">Important text</span>
```

## Testing Guidelines

### Manual Testing
1. Test all components in both light and dark modes
2. Verify color contrast meets accessibility standards
3. Check that semantic colors are used appropriately
4. Ensure hover and focus states work in both themes

### Automated Testing
```typescript
// Example component test
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('applies correct theme classes', () => {
    const { container } = render(<Button variant="primary">Test</Button>)
    const button = container.querySelector('button')
    
    expect(button).toHaveClass('bg-primary-500')
    expect(button).toHaveClass('dark:bg-primary-600')
    expect(button).toHaveClass('hover:bg-primary-600')
    expect(button).toHaveClass('dark:hover:bg-primary-700')
  })
})
```

## Migration Guide

If updating existing components to use the new color system:

1. **Audit current usage**: Find all hardcoded colors and non-theme-aware classes
2. **Replace with semantic classes**: Use `text-primary-600` instead of `text-[#C08A5A]`
3. **Add dark mode variants**: Every color class should have a dark mode equivalent
4. **Update CSS variables**: Ensure custom CSS uses the new variable names
5. **Test thoroughly**: Verify all components work in both light and dark modes

## Resources

- **Color Palette Viewer**: `/dev/colors` - Interactive color palette
- **Component Examples**: `/dev/components` - See colors in context
- **Documentation**: `/dev/colors/docs` - Detailed usage guide
- **Utility Functions**: `src/lib/utils/colors.ts` - Helper functions

---

For questions or updates to this color system, please consult the development team or update this documentation accordingly. 