import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Caching is explicit: data is dynamic unless a function opts in with
  // `use cache`. Also enables Partial Prerendering by default.
  // See IMPLEMENTATION.md section 2.
  cacheComponents: true,

  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
