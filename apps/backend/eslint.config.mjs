import tseslint from 'typescript-eslint'

import rootConfig from "../../eslint.config.mjs";

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
  rootConfig,
  {
    files: ["./**/*.ts", "./**/*.tsx"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ["apps/backend/tsconfig.*?.json"],
      },
    },
  }
)