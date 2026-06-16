/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 사이트로 내보내기 (호스팅 자유도 + SEO 정적 HTML)
  output: "export",
  trailingSlash: true,
  images: {
    // 정적 export에서는 Next 이미지 최적화를 사용할 수 없음
    unoptimized: true,
  },
};

export default nextConfig;
