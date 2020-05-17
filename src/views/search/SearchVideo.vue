<template>
  <ResultPage
    page="video"
    :finished="finished"
    @video="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @refresh="refresh"
  >
    <div ref="result">
      <ResultItem
        v-for="(item, index) in videos"
        :key="index"
        mode="video"
        imgDiv
        :imgUrl="item.coverUrl"
        :name="item.title"
        :durationms="item.durationms"
        :userName="item.creator[0].userName"
        :playCount="item.playTime"
      ></ResultItem>
    </div>
  </ResultPage>
</template>

<script>
import ResultItem from "@/components/ResultItem";
import ResultPage from "@/components/ResultPage";

export default {
  name: "SearchVideo",
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
      videos: []
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
    getData(key) {
      this.$fetch("/search", {
        keywords: key,
        type: 1014,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.videoCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.videoCount;
          }
          this.videos = this.videos.concat(result.videos);
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
      this.videos = [];
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
