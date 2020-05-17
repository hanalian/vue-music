<template>
  <div class="history-list" ref="history" @scroll="scrollHandler">
    <TopNav isBlack style="background-color: #fff">
      <p class="nav-title">最近播放</p>
    </TopNav>
    <div class="single-title" @click.stop="playAll">
      <a class="play-all">播放全部</a>
      <a class="play-select">多选</a>
    </div>
    <SongList alia :songs="list" @jump="toPlayer"></SongList>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import SongList from "@/components/SongList";
import { mapActions, mapState } from "vuex";

export default {
  name: "HistoryList",
  components: { TopNav, SongList },
  data() {
    return {
      list: [],
      offsetTop: 0
    };
  },
  created() {
    this.getData();
  },
  activated() {
    this.$refs.history.scrollTop = this.offsetTop;
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "home") {
      this.setKeepAlive(["HistoryList"]);
    }
    next();
  },
  computed: {
    ...mapState(["mode"])
  },
  methods: {
    ...mapActions([
      "getSongs",
      "getCurrentIndex",
      "getPlayList",
      "setPlaying",
      "setKeepAlive"
    ]),
    shuffle(arr) {
      let k = 0,
        temp;
      for (let i = arr.length - 1; i >= 0; i--) {
        k = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[k];
        arr[k] = temp;
      }
      return arr;
    },
    findNewIndex(list, id) {
      return list.findIndex(item => {
        return item.id === id;
      });
    },
    getData() {
      this.list = JSON.parse(localStorage.getItem("history"));
    },
    playAll() {
      this.toPlay(0);
    },
    scrollHandler(e) {
      this.offsetTop = e.srcElement.scrollTop;
    },
    toPlayer(item) {
      let index = this.findNewIndex(this.list, item.id);
      this.toPlay(index);
    },
    toPlay(i) {
      this.getSongs([...this.list]);
      let index = i;
      let playList = [...this.list];
      if (this.mode === 1 && this.list.length > 2) {
        playList = this.shuffle([...this.list]);
        index = this.findNewIndex(playList, this.list[i].id);
      }
      this.getPlayList(playList);
      this.getCurrentIndex(index);
      this.setPlaying(true);
      this.$router.push({ name: "player" });
    }
  }
};
</script>

<style scoped lang="less">
.history-list {
  height: 100%;
  overflow-y: auto;
}
.nav-title {
  font-size: 0.467rem;
  flex: 1;
}
.single-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.467rem;
}
.play-all {
  font-size: 0.453rem;
  line-height: 0.667rem;
  padding-left: 1rem;
  background: url("../assets/img/any.png") left center no-repeat;
  background-size: 0.6rem;
}
.play-select {
  font-size: 0.373rem;
  padding-left: 0.5rem;
  background: url("../assets/img/b2w1.png") left center no-repeat;
  background-size: 0.32rem 0.28rem;
}
</style>
