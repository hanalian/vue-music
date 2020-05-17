<template>
  <div class="toast" v-if="show">{{ text }}</div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      show: false,
      timer: 0
    };
  },
  props: {
    text: String,
    value: Boolean
  },
  watch: {
    show(val) {
      if (val) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.show = false;
          this.$emit("hide");
        }, 1000);
      }
    },
    value(val) {
      this.show = val;
    }
  }
};
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  padding: 0.4rem 0.6rem;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 0.427rem;
  border-radius: 0.8rem;
}
</style>
