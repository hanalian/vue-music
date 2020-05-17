<template>
  <div class="top-nav">
    <a class="back" @click="back" :class="{ 'back-black': isBlack }"></a>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TopNav",
  props: {
    isBlack: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.467rem;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  a {
    display: block;
    height: 1.467rem;
    line-height: 1.467rem;
    width: 1.333rem;
    text-align: center;
  }
  .back {
    background: url("../assets/img/y0.png") center no-repeat;
    background-size: 0.667rem;
    flex-shrink: 0;
  }
  .back-black {
    background: url("../assets/img/zf.png") center no-repeat;
    background-size: 0.667rem;
  }
}
</style>
