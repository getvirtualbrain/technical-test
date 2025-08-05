import js from '@eslint/js'
import pluginImports from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    plugins: {
      "import": pluginImports,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  },
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      // "no-unused-vars": "off", // Disable the base rule as it can conflict with unused-imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    rules: {
      "no-useless-escape": "error",
      "no-useless-concat": "error",
      "no-duplicate-imports": "error",
      "no-nested-ternary": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "indent": ["error", 2]
    }
  }
)