import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    cacheLife: { //Override the default profile and create your custom profile here.
        medium_short: { //Custom profile. 'medium_short' is the user-defined name.
            stale: 60,
             revalidate: 300,
              expire: 3600
        }
    }
};

export default nextConfig;
