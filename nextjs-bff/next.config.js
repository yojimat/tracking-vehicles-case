/** @type {import('next').NextConfig} */
// Config to fix a problem with the socket.io lib involving the packages utf-8-validate and bufferutil.
// https://github.com/vercel/next.js/issues/44273
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig
