/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['drizzle-orm', '@neondatabase/serverless'],
  transpilePackages: ['lucide-react'],
  images: {
    domains: []
  },
  output: 'standalone'
}

export default nextConfig