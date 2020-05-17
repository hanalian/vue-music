<template>
  <div class="loading-con">
    <div class="loading"></div>
    <span class="loading-text">努力加载中</span>
  </div>
</template>

<script>
export default {
  name: "Loading"
};
</script>

<style scoped>
.loading-con {
  width: 100px;
  margin: 0 auto;
}
.loading {
  height: 24px;
  width: 30px;
  display: inline-block;
  vertical-align: bottom;
  background: url("../assets/img/loading.png") no-repeat;
  animation: moveUp 0.4s steps(1) infinite alternate;
}
@keyframes moveUp {
  0% {
    background-position: 0;
  }
  33.3% {
    background-position: -30px;
  }
  66.6% {
    background-position: -60px;
  }
  100% {
    background-position: -90px;
  }
}
.loading-text {
}
</style>
