<script setup>
// const { data: users } = await useFetch(API.heroes);

const { data: mage } = await useFetch(API.mage);

const { data: tank } = await useFetch(API.tank, {
  headers: {
    Authorization: "abc",
  },
});
const { data: assassinBoo } = await useFetch(API.assassin, {
  headers: {
    locale: "boo",
    Authorization: "abc",
  },
});
const { data: assassinFaa } = await useFetch(API.assassin, {
  headers: {
    locale: "faa",
  },
});

await useFetch(API.register, {
  method: "post",
});
</script>

<template>
  <div>{{ mage }}</div>
</template>
