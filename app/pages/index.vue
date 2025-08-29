<script setup>
const { data: users } = await useFetch(API.users);

const { data: mage } = await useFetch(API.mage);

const { data: tank } = await useFetch(API.tank, {
  headers: {
    token: "abc",
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
</script>

<template>
  <div>{{ users }}</div>
</template>
