<template>
  <ResultPage
    page="list"
    :finished="finished"
    @list="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @refresh="refresh"
  >
    <div ref="result">
      <ResultItem
        v-for="(item, index) in playlists"
        :key="index"
        mode="playlist"
        oneLine
        small
        :imgUrl="item.coverImgUrl"
        :name="item.name"
        :trackCount="item.trackCount"
        :userName="item.creator.nickname"
        :playCount="item.playCount"
        @jump="toDetail(item)"
      ></ResultItem>
    </div>
  </ResultPage>
</template>

<script>
import ResultItem from "@/components/ResultItem";
import ResultPage from "@/components/ResultPage";

export default {
  name: "SearchList",
  components: { ResultItem, ResultPage },
  data() {
    return {
      finished: false,
      notfound: false,
      loading: true,
      pullUp: false,
      page: 1,
      count: 0,
      scrollHeight: 0,
      name: "",
      playlists: []
    };
  },
  activated() {
    if (this.name !== this.$route.params.name) {
      this.refresh(this.$route.params.name);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.refresh(to.params.name);
    next();
  },
  methods: {
    scrollToBottom() {
      this.finished = false;
      if (this.count > (this.page - 1) * 20) {
        this.pullUp = true;
        this.getData(this.$route.params.name);
      }
    },
    numberFormat(num) {
      let val;
      const k = 10000;
      if (num >= k && num < Math.pow(k, 2)) {
        val = parseInt(num / k) + "万";
      } else if (num >= Math.pow(k, 2)) {
        val = (num / Math.pow(k, 2)).toFixed(1) + "亿";
      } else {
        val = num;
      }
      return val;
    },
    toDetail(item) {
      this.$store.dispatch("setKeepAlive", []);
      this.$router.push({
        name: "playlist",
        params: {
          id: item.id,
          name: item.name,
          copy: "",
          mode: "playlist",
          num: this.numberFormat(item.playCount),
          picUrl: item.coverImgUrl
        }
      });
    },
    getData(key) {
      this.$fetch("/search", {
        keywords: key,
        type: 1000,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.playlistCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.playlistCount;
          }
          this.playlists = this.playlists.concat(result.playlists);
          this.$nextTick(() => {
            this.scrollHeight = this.$refs.result.scrollHeight;
          });
          this.page += 1;
          if (this.loading) {
            this.loading = false;
          } else this.pullUp = false;
          this.finished = true;
        })
        .catch(err => {
          console.log(err);
          if (this.loading) {
            this.notfound = true;
            this.loading = false;
          }
          this.pullUp = false;
        });
    },
    refresh(key) {
      this.playlists = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.getData(key);
      this.name = key;
    }
  }
};
</script>

<style scoped></style>
