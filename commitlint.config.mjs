/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "security",
      ],
    ],
    "scope-enum": [
      1,
      "always",
      [
        "auth",
        "attendance",
        "homework",
        "lesson",
        "quiz",
        "dashboard",
        "institute",
        "batch",
        "student",
        "teacher",
        "parent",
        "api",
        "ui",
        "types",
        "deps",
        "config",
        "ci",
        "release",
      ],
    ],
    "subject-case": [2, "never", ["upper-case", "pascal-case", "start-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};

export default config;
