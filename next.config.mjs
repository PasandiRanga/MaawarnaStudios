/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    /* next build serializes the ESLint config to a worker, which fails on the
       parser object that next/core-web-vitals pulls in ("Cannot serialize key
       parse"). The step has never actually enforced anything here — it only
       failed in different ways. Lint runs as its own command instead: npm run lint. */
    ignoreDuringBuilds: true,
  },
  images: {
    /* AVIF first: on photographs it lands roughly 25–35% under WebP at matching
       quality, and browsers that don't take it fall through to WebP. */
    formats: ['image/avif', 'image/webp'],
    /* The gallery images are content-hashed static imports, so a transformed
       copy stays valid until the file itself changes — no reason to re-transform
       these on a 60-second cadence. */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
