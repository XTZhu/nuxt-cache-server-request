export const getUrl = (path: string) => {
  // 修改为测试接口
  const baseUrl = process.env.BASE_URL || "http://localhost:5180";
  return `${baseUrl}${path}`;
};

export const API = {
  heroes: getUrl("/api/heroes"),
  tank: getUrl("/api/player/tank"),
  mage: getUrl("/api/player/mage"),
  assassin: getUrl("/api/player/assassin"),
  login: getUrl("/api/user/login"),
  logout: getUrl("/api/user/logout"),
  register: getUrl("/api/user/register"),
  update: getUrl("/api/player/update"),
};
