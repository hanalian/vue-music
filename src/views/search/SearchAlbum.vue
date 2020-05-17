<template>
  <ResultPage
    page="album"
    :finished="finished"
    @album="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @refresh="refresh"
  >
    <div ref="result">
      <ResultItem
        v-for="(item, index) in albums"
        :key="index"
        mode="album"
        imgDiv
        oneLine
        small
        :imgUrl="item.picUrl"
        :name="item.name"
        :userName="item.artist.name"
        :alias="item.alias.length > 0 ? item.alias[0] : ''"
        :publishTime="item.publishTime"
        @jump="toDetail(item)"
      ></ResultItem>
    </div>
  </ResultPage>
</template>

<script>
import ResultItem from "@/components/ResultItem";
import ResultPage from "@/components/ResultPage";

export default {
  name: "SearchAlbum",
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
      albums: []
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
    toDetail(item) {
      this.$store.dispatch("setKeepAlive", []);
      let name =
        item.alias.length > 0 ? `${item.name}(${item.alias[0]})` : item.name;
      this.$router.push({
        name: "playlist",
        params: {
          id: item.id,
          name: name,
          copy: "",
          mode: "album",
          num: 0,
          picUrl: item.picUrl
        }
      });
    },
    getData(key) {
      this.$fetch("/search", {
        keywords: key,
        type: 10,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.albumCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.albumCount;
          }
          this.albums = this.albums.concat(result.albums);
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
      this.albums = [];
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
