import { ProxyAgent } from "undici";
import HPA from "https-proxy-agent";
// import { needCache, generateCacheKey, cache, pending } from "../utils/helper";

// https://github.com/unjs/ofetch/issues/215
// 兼容node 18开始的 undici
const devProxy = {
  dispatcher: new ProxyAgent("http://localhost:12888"),
  agent: new HPA.HttpsProxyAgent("http://localhost:12888"),
};

// eslint-disable-next-line node/prefer-global/process
console.log(process.env.NODE_ENV);

console.log("hello");

export default defineNuxtPlugin((_nitroApp) => {
  console.log(
    "------------------server fetch plugins init----------------------"
  );
  const rawFetch = $fetch.create({
    timeout: 30 * 1000,
    retry: 0,
    onRequest: ({ request, options }) => {
      // 只记录可序列化的信息
      // console.log(
      //   "----------请求接口:",
      //   typeof request === "string" ? request : "Request object"
      // );
    },
    onResponse: ({ response, options }) => {},
    onRequestError: ({ request, options, error }) => {},
    onResponseError: () => {},
    ignoreResponseError: false,
    ...devProxy,
  });

  async function cachedFetch(url: string, opts?: any) {
    // 简化日志输出，避免复杂对象
    console.log(opts?.method, "📞请求 URL:", url);

    if (!needCache(url, opts)) {
      return rawFetch(url, opts);
    }

    const key = generateCacheKey(url, opts || {});
    console.log("🔑cache key:", key);
    if (cache.has(key)) {
      console.log("❤️命中缓存:", url);
      return cache.get(key);
    }
    if (pending.has(key)) {
      console.log("🚰等待中:", url);
      return pending.get(key);
    }
    const p = rawFetch(url, opts)
      .then((res: any) => {
        cache.set(key, res);
        return res;
      })
      .finally(() => {
        pending.delete(key);
      });
    pending.set(key, p);
    return p;
  }

  // 保留 $fetch 的类型和方法
  globalThis.$fetch = Object.assign(cachedFetch, rawFetch);
});
