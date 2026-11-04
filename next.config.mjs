/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The Stew player ships as an ES module only. Left as an outside package, it
  // turns the homepage into an async module and Next then misreads its
  // getStaticProps. Bundling it keeps the page static.
  transpilePackages: ['@stew-engine/player'],
};

export default nextConfig;
