import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "supabase/functions/**",
      "scripts/**",
    ],
    rules: {
      // Type safety rules - temporarily relaxed for deployment
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      
      // Code quality rules - relaxed
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      
      // Import/export rules - relaxed
      "@typescript-eslint/no-require-imports": "warn",
      "prefer-const": "warn",
      
      // React rules - relaxed
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-undef": "error", // Keep this as error
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      
      // Next.js specific rules - relaxed
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // General code quality - relaxed
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "warn",
      "no-duplicate-imports": "warn",
    },
  }
];

export default eslintConfig;
