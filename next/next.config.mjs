/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['geist'],
    images: {
        remotePatterns: [
            {
                hostname: 'upkevvurbavuijzpcaxj.supabase.co',
                protocol: 'https',
            },
        ],
    },
}

export default nextConfig
