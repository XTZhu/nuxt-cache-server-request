<script setup>
const { data } = await useFetch("http://localhost:5180/api/users");
</script>

<template>
  <div>{{ data }}</div>
</template>
