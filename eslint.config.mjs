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
      // Type safety rules - strict enforcement
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      
      // Code quality rules
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      
      // Import/export rules
      "@typescript-eslint/no-require-imports": "error",
      "prefer-const": "error",
      
      // React rules
      "react/no-unescaped-entities": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      
      // Next.js specific rules
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "error",
      
      // General code quality
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
    },
  }
];

export default eslintConfig;
