<template>
  <div
    class="result-page"
    ref="resultPage"
    @scroll="scrollHandler"
    :style="{
      height:
        $store.state.songs.length > 0
          ? 'calc(100vh - 3.6rem)'
          : 'calc(100vh - 2.467rem)'
    }"
  >
    <Loading class="result-loading" v-if="loading"></Loading>
    <p class="notfound" v-else-if="notfound">
      未找到与"{{ $route.params.name }}"相关的内容
    </p>
    <slot v-else></slot>
    <Loading v-if="pullUp" style="margin: 0.12rem auto"></Loading>
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  name: "ResultPage",
  components: { Loading },
  data() {
    return {
      offsetTop: 0,
      name: ""
    };
  },
  props: {
    page: String,
    finished: Boolean,
    scrollHeight: Number,
    loading: {
      type: Boolean,
      default: false
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    notfound: {
      type: Boolean,
      default: false
    },
    pageName: {
      type: String,
      default: ""
    }
  },
  activated() {
    this.$refs.resultPage.scrollTop = this.offsetTop;
    if (this.pageName === this.$route.params.name) {
      this.$refs.resultPage.scrollTop = Number(
        localStorage.getItem(this.pageName)
      );
    }
  },
  deactivated() {
    localStorage.setItem(this.pageName, this.offsetTop);
  },
  destroyed() {
    localStorage.removeItem(this.pageName);
  },
  watch: {},
  methods: {
    scrollHandler(e) {
      let scrollTop = e.srcElement.scrollTop;
      this.offsetTop = scrollTop;
      let offsetHeight = this.$refs.resultPage.offsetHeight;
      if (this.finished && scrollTop + offsetHeight > this.scrollHeight - 20) {
        this.$emit(this.page);
      }
    }
  }
};
</script>

<style scoped lang="less">
.result-page {
  box-sizing: border-box;
  padding: 0.267rem 0;
  overflow-y: scroll;
  .result-loading {
    margin-top: 0.4rem;
  }
}
.notfound {
  text-align: center;
  margin-top: 0.8rem;
  color: #999;
  font-size: 0.347rem;
}
</style>
