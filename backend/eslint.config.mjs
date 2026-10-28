import { defineConfig } from "eslint/config";
import mainConfig from "../../eslint.config.mjs";

export default defineConfig([
	mainConfig,
	{
		files: ["./**/*.ts", "./**/*.tsx"],

		languageOptions: {
			ecmaVersion: 12,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},

				project: ["apps/api/tsconfig.*?.json"],
			},
		},
	}
]);