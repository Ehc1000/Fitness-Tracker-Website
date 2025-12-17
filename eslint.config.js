import globals from "globals";
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  jestPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
