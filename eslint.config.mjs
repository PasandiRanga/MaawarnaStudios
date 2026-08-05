import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  /* Flat config only ignores node_modules by default, so build output would
     otherwise be linted — the emitted webpack chunks trip no-assign-module-variable. */
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
