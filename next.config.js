/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
      NEXT_PUBLIC_AN_APIKEY: process.env.NEXT_PUBLIC_AN_APIKEY,
      NEXT_PUBLIC_AN_MSID: process.env.NEXT_PUBLIC_AN_MSID,
      NEXT_PUBLIC_AN_APPID: process.env.NEXT_PUBLIC_AN_APPID,
      NEXT_PUBLIC_AN_MID: process.env.NEXT_PUBLIC_AN_MID
  }
}

module.exports = nextConfig
