import { ProxyAgent } from "undici";
import HPA from "https-proxy-agent";

// https://github.com/unjs/ofetch/issues/215
// 兼容node 18开始的 undici
const devProxy = {
  dispatcher: new ProxyAgent("http://localhost:12888"),
  agent: new HPA.HttpsProxyAgent("http://localhost:12888"),
};

// eslint-disable-next-line node/prefer-global/process
console.log(process.env.NODE_ENV);

export default defineNuxtPlugin((_nitroApp) => {
  globalThis.$fetch = $fetch.create({
    timeout: 30 * 1000,
    // 服务端不进行重试
    retry: 0,
    onRequest: ({ request, options }) => {
      console.log("请求接口", request);
    },
    onResponse: ({ response, options }) => {},
    onRequestError: ({ request, options, error }) => {},
    onResponseError: () => {},
    // 这里要false 不然没法手动catch错误
    ignoreResponseError: false,
    ...devProxy,
  });
});
