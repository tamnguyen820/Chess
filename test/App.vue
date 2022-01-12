<template>
  <div>
    <div>{{ content }}</div>
    <button @click="changeContent">Change content</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({
      content: "texts/getContent",
    }),
  },
  methods: {
    ...mapMutations({
      changeContent: "texts/setContent",
    }),
  },
};
</script>

<style  lang="scss" scoped>
</style>