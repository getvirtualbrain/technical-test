import js from '@eslint/js'
import pluginImports from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react"
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from "eslint-plugin-unused-imports";
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    // new rules added by Hovannes
    {
        plugins: {
          react: pluginReact,
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/react-in-jsx-scope": "off",
            "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
            "react/self-closing-comp": ["error", { component: true, html: true }],
        }
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
        }
    }
)