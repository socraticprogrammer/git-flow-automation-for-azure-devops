module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb", "airbnb-typescript/base"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["import", "@typescript-eslint"],
};
