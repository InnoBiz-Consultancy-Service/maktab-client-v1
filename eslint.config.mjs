import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const spread = (c) => (Array.isArray(c) ? c : [c]);

/**
 * RULE POLICY — ratchet, not big-bang. See SETUP.md §5.
 * Added rules start as "warn" so this config doesn't make an existing
 * codebase un-committable. Promote to "error" as you clear each category.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
      "public/**",
    ],
  },

  // Next.js native flat configs — NO FlatCompat.
  ...spread(nextVitals),
  ...spread(nextTypescript),

  {
    rules: {
      // verified clean on your repo — these block immediately
      "no-debugger": "error",
      "no-alert": "error",
      "no-var": "error",

      // backlog — warn now, promote to "error" once cleared
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      eqeqeq: ["warn", "always", { null: "ignore" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["../../../*"],
              message:
                "Use the '@/' path alias instead of deep relative paths.",
            },
          ],
        },
      ],
    },
  },

  // server code reading a client-visible env var
  {
    files: ["src/actions/**/*.ts", "src/lib/api/**/*.ts"],
    ignores: ["**/__tests__/**"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env'] > Identifier[name=/^NEXT_PUBLIC_/]",
          message:
            "Server code is reading a NEXT_PUBLIC_ env var. That value is public — confirm this is intentional.",
        },
      ],
    },
  },

  {
    files: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/*.test.[jt]s?(x)",
      "jest.setup.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "off",
      "no-restricted-syntax": "off",
    },
  },

  // MUST BE LAST — disables every rule that fights Prettier
  prettierConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;

// node -e "const r=require('./eslint-report.json');for(const f of r)for(const x of f.messages)if(/set-state-in-effect|purity/.test(x.ruleId||''))console.log(f.filePath.replace(process.cwd(),'.')+':'+x.line)"
