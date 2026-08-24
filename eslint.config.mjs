import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import sonarjs from "eslint-plugin-sonarjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import unicorn from "eslint-plugin-unicorn";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  ...sonarjs.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      unicorn,
    },
    rules: {
      "unicorn/prefer-module": "error",
    },
  },
]);
