import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opt in later: `cacheComponents: true` requires every `generateStaticParams` to
  // return ≥1 path (see EmptyGenerateStaticParamsError). Audit Sanity-backed
  // routes that can return [] before enabling.
  // cacheComponents: true,

  experimental: {
    // Faster dev restarts on large projects
    turbopackFileSystemCacheForDev: true,
  },

  logging: {
    browserToTerminal: "error",
  },

  // Used by `revalidateTag(tag, "sanity")` after webhook — long-lived refresh semantics
  cacheLife: {
    sanity: {
      stale: 60 * 60 * 24 * 7,
      revalidate: 60 * 60 * 24 * 30,
      expire: 60 * 60 * 24 * 365,
    },
    static: {
      stale: 60 * 60 * 24 * 7,
      revalidate: 60 * 60 * 24,
      expire: 60 * 60 * 24 * 30,
    },
    standard: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
    live: {
      stale: 10,
      revalidate: 30,
      expire: 60,
    },
  },

  async redirects() {
    return [
      {
        source: "/:locale/sitemap.xml",
        destination: "/sitemap.xml",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/video-sitemap.xml",
        destination: "/video-sitemap.xml",
        locale: false,
      },
    ];
  },
  webpack: (config) => {
    // Add video file handling (production builds use `next build --webpack`)
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: "[name].[ext]",
          publicPath: "/_next/static/videos/",
          outputPath: "static/videos/",
        },
      },
    });
    return config;
  },

  images: {
    minimumCacheTTL: 14400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
