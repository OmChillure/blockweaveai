import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
  } from "next/constants.js";
  
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    images:{
      remotePatterns: [{
        hostname:"assets.aceternity.com",
        protocol:"https"
      }, {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**'
      }]
      
    },
    reactStrictMode: true,
    experimental:{
      serverActions:{
        allowedOrigins:["localhost:3000"]
      }
    }
  };
  
  const nextConfigFunction = async (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
      const withPWA = (await import("@ducanh2912/next-pwa")).default({
        dest: "public",
      });
      return withPWA(nextConfig);
    }
    return nextConfig;
  };
  
  export default nextConfigFunction;