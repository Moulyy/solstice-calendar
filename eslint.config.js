import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "docs/.vitepress/cache/**",
      "docs/.vitepress/dist/**"
    ]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      quotes: ["error", "double"],
      semi: ["error", "never"],
      "max-len": ["error", { code: 100 }]
    }
  }
]
