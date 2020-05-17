<template>
  <div class="cat-list">
    <TopNav isBlack>
      <p class="nav-title">{{ cat }}</p>
    </TopNav>
    <ResultPage
      page="catlist"
      :finished="finished"
      @catlist="scrollToBottom"
      :notfound="notfound"
      :loading="loading"
      :pullUp="pullUp"
      :scrollHeight="scrollHeight"
      :style="{
        height:
          $store.state.songs.length > 0
            ? 'calc(100vh - 2.8rem)'
            : 'calc(100vh - 1.467rem)'
      }"
    >
      <div class="play-list" ref="playlist">
        <div
          v-for="(item, index) in playlists"
          :key="index"
          @click="toDetail(item)"
          class="list-item"
        >
          <img v-lazy="item.coverImgUrl" alt="" />
          <p>{{ item.name }}</p>
          <span class="play-count">{{ numberFormat(item.playCount) }}</span>
        </div>
      </div>
    </ResultPage>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import ResultPage from "@/components/ResultPage";
export default {
  name: "CatList",
  components: { TopNav, ResultPage },
  data() {
    return {
      finished: false,
      notfound: false,
      loading: true,
      pullUp: false,
      page: 1,
      count: 0,
      scrollHeight: 0,
      playlists: [],
      cat: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "playlist") {
      this.$store.dispatch("setKeepAlive", []);
    } else this.$store.dispatch("setKeepAlive", ["CatList"]);
    next();
  },
  created() {
    this.cat = this.$route.params.cat;
    this.getList();
  },
  methods: {
    scrollToBottom() {
      this.finished = false;
      if (this.count > (this.page - 1) * 20) {
        this.pullUp = true;
        this.getList();
      }
    },
    numberFormat(num) {
      let val;
      const k = 100000;
      if (num >= k && num < Math.pow(k, 2)) {
        val = parseInt((num * 10) / k) + "万";
      } else if (num >= Math.pow(k, 2)) {
        val = (num / Math.pow(k, 2)).toFixed(1) + "亿";
      } else {
        val = num;
      }
      return val;
    },
    getList() {
      this.$fetch("/top/playlist", {
        limit: 30,
        offset: (this.page - 1) * 30,
        cat: this.cat
      })
        .then(data => {
          let playlists = data.playlists;
          this.count = data.total;
          this.playlists = this.playlists.concat(playlists);
          this.$nextTick(() => {
            this.scrollHeight = this.$refs.playlist.scrollHeight;
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
    toDetail(item) {
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
    }
  }
};
</script>

<style scoped lang="less">
.nav-title {
  font-size: 0.467rem;
  flex: 1;
}
.play-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0.4rem;
  margin-top: 0.2rem;
}
.list-item {
  position: relative;
  width: 2.867rem;
  margin-bottom: 0.4rem;
  img {
    height: 2.867rem;
    width: 2.867rem;
    background-color: #aaa;
    border-radius: 0.133rem;
    display: block;
  }
  p {
    color: #333;
    font-size: 0.34rem;
    margin-top: 0.06rem;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.play-count {
  position: absolute;
  top: 0.08rem;
  right: 0.16rem;
  padding-left: 0.44rem;
  color: #fff;
  font-size: 0.32rem;
  background: url("../assets/img/note1.png") left -0.01rem no-repeat;
  background-size: 0.5rem;
}
</style>
