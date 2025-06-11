import { colors } from "@/styles/colors";

// Theme-aware color utilities
export const getThemeColor = (colorName: string, shade: number, isDark: boolean = false) => {
  const colorFamily = colors[colorName as keyof typeof colors];

  if (!colorFamily || typeof colorFamily === "string") {
    return colorFamily || "#000000";
  }

  const shadeKey = shade.toString();
  const color = colorFamily[shadeKey as keyof typeof colorFamily];

  return typeof color === "string" ? color : "#000000";
};

// Component-specific color schemes
export const colorSchemes = {
  // Button color schemes
  button: {
    primary: {
      light: {
        bg: colors.primary[500],
        hoverBg: colors.primary[600],
        text: "#FFFFFF",
        border: colors.primary[500],
      },
      dark: {
        bg: colors.primary[600],
        hoverBg: colors.primary[700],
        text: "#FFFFFF",
        border: colors.primary[600],
      },
    },
    secondary: {
      light: {
        bg: colors.secondary[500],
        hoverBg: colors.secondary[600],
        text: "#FFFFFF",
        border: colors.secondary[500],
      },
      dark: {
        bg: colors.secondary[600],
        hoverBg: colors.secondary[700],
        text: "#FFFFFF",
        border: colors.secondary[600],
      },
    },
    outline: {
      light: {
        bg: "transparent",
        hoverBg: colors.neutral[100],
        text: colors.neutral[700],
        border: colors.neutral[300],
      },
      dark: {
        bg: "transparent",
        hoverBg: colors.neutral[800],
        text: colors.neutral[200],
        border: colors.neutral[600],
      },
    },
  },

  // Card color schemes
  card: {
    default: {
      light: {
        bg: colors.light.card,
        text: colors.light.cardForeground,
        border: colors.light.border,
        shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      },
      dark: {
        bg: colors.dark.card,
        text: colors.dark.cardForeground,
        border: colors.dark.border,
        shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
      },
    },
    glass: {
      light: {
        bg: "rgba(255, 255, 255, 0.2)",
        text: colors.light.cardForeground,
        border: "rgba(255, 255, 255, 0.2)",
        backdrop: "blur(12px)",
      },
      dark: {
        bg: "rgba(0, 0, 0, 0.2)",
        text: colors.dark.cardForeground,
        border: "rgba(255, 255, 255, 0.1)",
        backdrop: "blur(12px)",
      },
    },
  },

  // Text color schemes
  text: {
    primary: {
      light: colors.light.foreground,
      dark: colors.dark.foreground,
    },
    secondary: {
      light: colors.light.mutedForeground,
      dark: colors.dark.mutedForeground,
    },
    muted: {
      light: colors.neutral[600],
      dark: colors.neutral[400],
    },
  },

  // Background color schemes
  background: {
    page: {
      light: colors.light.background,
      dark: colors.dark.background,
    },
    muted: {
      light: colors.light.muted,
      dark: colors.dark.muted,
    },
    accent: {
      light: colors.primary[50],
      dark: colors.primary[900],
    },
  },

  // Status color schemes
  status: {
    success: {
      light: {
        bg: colors.success[50],
        text: colors.success[700],
        border: colors.success[200],
        icon: colors.success[600],
      },
      dark: {
        bg: colors.success[900],
        text: colors.success[100],
        border: colors.success[700],
        icon: colors.success[500],
      },
    },
    warning: {
      light: {
        bg: colors.warning[50],
        text: colors.warning[700],
        border: colors.warning[200],
        icon: colors.warning[600],
      },
      dark: {
        bg: colors.warning[900],
        text: colors.warning[100],
        border: colors.warning[700],
        icon: colors.warning[500],
      },
    },
    danger: {
      light: {
        bg: colors.danger[50],
        text: colors.danger[700],
        border: colors.danger[200],
        icon: colors.danger[600],
      },
      dark: {
        bg: colors.danger[900],
        text: colors.danger[100],
        border: colors.danger[700],
        icon: colors.danger[500],
      },
    },
  },
};

// CSS-in-JS style generator for theme-aware components
export const createThemeStyles = (scheme: string, variant: string, isDark: boolean = false) => {
  const themeMode = isDark ? "dark" : "light";
  const colorScheme = colorSchemes[scheme as keyof typeof colorSchemes];

  if (!colorScheme || !colorScheme[variant as keyof typeof colorScheme]) {
    return {};
  }

  const styles = colorScheme[variant as keyof typeof colorScheme][themeMode as "light" | "dark"];

  return {
    backgroundColor: styles.bg,
    color: styles.text,
    borderColor: styles.border,
    ...(styles.shadow && { boxShadow: styles.shadow }),
    ...(styles.backdrop && { backdropFilter: styles.backdrop }),
  };
};

// Tailwind class generator for consistent theming
export const getThemeClasses = (
  scheme: "button" | "card" | "text" | "background" | "status",
  variant: string,
  additionalClasses: string = ""
) => {
  const baseClasses: Record<string, Record<string, string>> = {
    button: {
      primary:
        "bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white border-primary-500 dark:border-primary-600",
      secondary:
        "bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-700 text-white border-secondary-500 dark:border-secondary-600",
      outline:
        "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600",
    },
    card: {
      default:
        "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700",
      glass: "bg-white/20 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10",
    },
    text: {
      primary: "text-neutral-900 dark:text-neutral-100",
      secondary: "text-neutral-600 dark:text-neutral-400",
      muted: "text-neutral-500 dark:text-neutral-500",
    },
    background: {
      page: "bg-white dark:bg-neutral-900",
      muted: "bg-neutral-50 dark:bg-neutral-800",
      accent: "bg-primary-50 dark:bg-primary-900",
    },
    status: {
      success:
        "bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-100 border-success-200 dark:border-success-700",
      warning:
        "bg-warning-50 dark:bg-warning-900 text-warning-700 dark:text-warning-100 border-warning-200 dark:border-warning-700",
      danger:
        "bg-danger-50 dark:bg-danger-900 text-danger-700 dark:text-danger-100 border-danger-200 dark:border-danger-700",
    },
  };

  const classes = baseClasses[scheme]?.[variant] || "";
  return `${classes} ${additionalClasses}`.trim();
};

// Hex to HSL conversion helper
export const hexToHsl = (hex: string): string => {
  // Remove the # if it exists
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Export individual color values for direct usage
export { colors };
export default colors;
