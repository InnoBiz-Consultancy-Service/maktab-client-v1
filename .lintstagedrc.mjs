const config = {
  "*.{ts,tsx}": ["eslint --fix --no-warn-ignored", "prettier --write"],
  "*.{js,jsx,mjs,cjs}": ["eslint --fix --no-warn-ignored", "prettier --write"],
  "*.{json,jsonc,md,mdx,css,yml,yaml}": ["prettier --write"],
};

export default config;
