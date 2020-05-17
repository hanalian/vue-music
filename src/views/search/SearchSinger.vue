<template>
  <ResultPage
    page="singer"
    :finished="finished"
    @singer="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @refresh="refresh"
  >
    <div ref="result">
      <ResultItem
        v-for="(item, index) in artists"
        :key="index"
        mode="artist"
        small
        :imgUrl="item.picUrl"
        :name="item.name"
        :alias="item.alias.length > 0 ? item.alias[0] : ''"
        :accountId="Boolean(item.accountId)"
      ></ResultItem>
    </div>
  </ResultPage>
</template>

<script>
import ResultPage from "@/components/ResultPage";
import ResultItem from "@/components/ResultItem";

export default {
  name: "SearchSinger",
  components: { ResultPage, ResultItem },
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
      artists: []
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
        type: 100,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.artistCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.artistCount;
          }
          this.artists = this.artists.concat(result.artists);
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
      this.artists = [];
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
