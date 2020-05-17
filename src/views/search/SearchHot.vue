<template>
  <div class="search-hot-page">
    <Loading class="hot-loading" v-if="loading"></Loading>
    <div class="search-hot" v-else>
      <p class="search-hot-title">热门搜索</p>
      <div class="hot">
        <a
          v-for="(item, index) in hots"
          :key="index"
          @click="toResult(item.first)"
          >{{ item.first }}</a
        >
      </div>
      <p class="search-hot-title search-history">
        历史记录<a class="history-del" @click.stop="confirm = true"></a>
      </p>
      <div class="hot history">
        <a
          v-for="(item, index) in history"
          :key="index"
          @click="toResult(item)"
          >{{ item }}</a
        >
      </div>
      <div class="alert" v-transfer-dom>
        <Confirm v-model="confirm" title="确认" @on-confirm="del">
          <p style="text-align:center;">确认要删除历史记录吗？</p>
        </Confirm>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { Confirm, TransferDom } from "vux";

export default {
  name: "Hot",
  components: { Loading, Confirm },
  directives: {
    TransferDom
  },
  data() {
    return {
      hots: [],
      history: [],
      loading: true,
      confirm: false
    };
  },
  created() {
    this.$fetch("/search/hot")
      .then(data => {
        this.hots = data.result.hots;
        this.loading = false;
      })
      .catch(err => console.log(err));
    this.history = JSON.parse(localStorage.getItem("word"));
  },
  methods: {
    toResult(key) {
      this.$router.replace({
        path: "/search/detail/" + key + "/result"
      });
      this.$emit("word", key);
    },
    del() {
      localStorage.setItem("word", JSON.stringify([]));
      this.history = [];
    }
  }
};
</script>

<style scoped>
.search-hot-page .hot-loading {
  margin-top: 0.8rem;
}
.search-hot {
  padding: 0 0.4rem;
}
.search-hot-title {
  font-size: 0.427rem;
  font-weight: bold;
  padding: 0.4rem 0;
}
.hot a {
  display: inline-block;
  padding: 0.133rem 0.266rem;
  margin-bottom: 0.24rem;
  margin-right: 0.2rem;
  border-radius: 15px;
  font-size: 0.427rem;
  background-color: rgba(0, 0, 0, 0.05);
}
.search-history {
  position: relative;
}
.history-del {
  display: block;
  position: absolute;
  top: 0.333rem;
  right: 0;
  height: 0.733rem;
  width: 0.733rem;
  background: url("../../assets/img/note_rdi_btn_dlt_white.png") center no-repeat;
  background-size: 0.5rem;
}
</style>
