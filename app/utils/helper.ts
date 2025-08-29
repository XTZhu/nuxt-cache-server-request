import { LRUCache } from "lru-cache";

const REQUEST_METHODS = ["POST", "PUT", "DELETE", "UPDATE"];

export function generateCacheKey(url: string, options: any): string {
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

// LRU 缓存和并发锁
export const cache = new LRUCache<string, any>({ max: 100, ttl: 1000 * 60 });
export const pending = new Map<string, Promise<any>>();

export function needCache(url: string, options: any): boolean {
  //   if (process.env.NODE_ENV === "development") {
  //     return false;
  //   }
  console.log("options.method:", options.method);
  console.log("options.headers:", options.headers);
  //  put post delete update 不缓存
  if (REQUEST_METHODS.includes(options?.method?.toUpperCase())) {
    return false;
  }

  // 如果header中包含token 不缓存
  if (
    options.headers &&
    (options.headers.Authorization || options.headers.skipCache)
  ) {
    return false;
  }

  // 如果url中包含token 不缓存
  //   if (url.includes("token")) {
  //     return false;
  //   }

  //   如果url包含 /api/user, 不缓存
  if (url.includes("/api/user")) {
    return false;
  }

  return true;
}
