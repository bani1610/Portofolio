import type { NextConfig } from 'next';

// Supabase Storage serves every public bucket from the project host under
// /storage/v1/object/public/. Narrowing to that prefix keeps the image
// optimizer from being pointed at arbitrary URLs on the same host.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Caching is explicit: data is dynamic unless a function opts in with
  // `use cache`. Also enables Partial Prerendering by default.
  // See IMPLEMENTATION.md section 2.
  cacheComponents: true,

  images: {
    formats: ['image/webp'],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname,
            port: '',
            pathname: '/storage/v1/object/public/**',
            search: '',
          },
        ]
      : [],
  },
};

export default nextConfig;
