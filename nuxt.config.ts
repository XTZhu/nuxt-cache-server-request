// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // 添加 Nitro 配置来改善序列化问题
  nitro: {
    // 改善开发时的日志序列化
    logLevel: "info",
    // 配置序列化选项
    experimental: {
      wasm: false,
    },
  },

  // 开发时配置
  devServer: {
    port: 3000,
  },
});
