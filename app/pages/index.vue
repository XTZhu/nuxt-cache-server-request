<script setup>
const { data: users } = await useFetch(API.heroes);

const { data: mage } = await useFetch(API.mage, {
  headers: {
    skipCache: true,
  },
});

const { data: tank } = await useFetch(API.tank, {
  headers: {
    Authorization: "abc",
  },
});
const { data: assassinBoo } = await useFetch(API.assassin, {
  headers: {
    locale: "boo",
  },
});
const { data: assassinFaa } = await useFetch(API.assassin, {
  headers: {
    locale: "faa",
  },
});
const { data: login } = await useFetch(API.login);
const { data: logout } = await useFetch(API.logout, {
  headers: {
    skipCache: true,
  },
});
await useFetch(API.register, {
  method: "post",
});
const { data: update } = await useFetch(API.update, {
  method: "put",
});

// 会缓存的接口为
// get /api/heroes
// get /api/player/assassin
</script>

<template>
  <div>
    <ul>
      <NuxtLink to="/fetch-all">fetch-all</NuxtLink>
    </ul>
    <div>{{ users }}</div>
  </div>
</template>
