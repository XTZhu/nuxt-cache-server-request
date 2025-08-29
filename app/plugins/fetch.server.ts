import { ProxyAgent } from "undici";
import HPA from "https-proxy-agent";
import { LRUCache } from "lru-cache";

// https://github.com/unjs/ofetch/issues/215
// 兼容node 18开始的 undici
const devProxy = {
  dispatcher: new ProxyAgent("http://localhost:12888"),
  agent: new HPA.HttpsProxyAgent("http://localhost:12888"),
};

// eslint-disable-next-line node/prefer-global/process
console.log(process.env.NODE_ENV);

// LRU 缓存和并发锁
const cache = new LRUCache<string, any>({ max: 100, ttl: 1000 * 60 });
const pending = new Map<string, Promise<any>>();

function generateCacheKey(url: string, options: any): string {
  const { method, headers, params, query } = options;

  // 安全地提取 headers 中的值，避免序列化 Headers 对象
  let locale = "";
  if (headers && typeof headers === "object") {
    // 如果是 Headers 对象，使用 get 方法
    if (headers instanceof Headers) {
      locale = headers.get("locale") || "";
    } else if (headers.locale) {
      // 如果是普通对象
      locale = headers.locale;
    }
  }

  const keyParts = [
    url,
    method || "GET",
    locale,
    // 安全地序列化 params 和 query
    JSON.stringify(params || {}),
    JSON.stringify(query || {}),
  ];
  const key = keyParts.join("|");
  console.log("cache key:", key);
  return key;
}

export default defineNuxtPlugin((_nitroApp) => {
  const rawFetch = $fetch.create({
    timeout: 30 * 1000,
    retry: 0,
    onRequest: ({ request, options }) => {
      // 只记录可序列化的信息
      console.log(
        "请求接口:",
        typeof request === "string" ? request : "Request object"
      );
    },
    onResponse: ({ response, options }) => {},
    onRequestError: ({ request, options, error }) => {},
    onResponseError: () => {},
    ignoreResponseError: false,
    ...devProxy,
  });

  async function cachedFetch(url: string, opts?: any) {
    // 简化日志输出，避免复杂对象
    console.log("请求 URL:", url);
    console.log("请求方法:", opts?.method || "GET");

    const key = generateCacheKey(url, opts || {});
    if (cache.has(key)) {
      console.log("命中缓存:", url);
      return cache.get(key);
    }
    if (pending.has(key)) {
      console.log("等待中:", url);
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
