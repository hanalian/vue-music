<template>
  <ResultPage
    page="single"
    :finished="finished"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @single="scrollToBottom"
    @refresh="refresh"
  >
    <div ref="result">
      <div class="single-title" @click.stop="playAll">
        <a class="play-all">播放全部</a>
        <a class="play-select">多选</a>
      </div>
      <SongList alia :songs="songList" @jump="toPlayer"></SongList>
    </div>
    <Toast :text="text" v-model="toast" @hide="hide"></Toast>
  </ResultPage>
</template>

<script>
import ResultPage from "@/components/ResultPage";
import SongList from "@/components/SongList";
import Toast from "@/components/Toast";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "SearchSingle",
  components: { SongList, ResultPage, Toast },
  data() {
    return {
      finished: false,
      notfound: false,
      loading: true,
      pullUp: false,
      songList: [], //显示在界面的列表
      list: [], //全部播放列表
      page: 1,
      count: 0,
      scrollHeight: 0,
      name: "",
      text: "",
      toast: false
    };
  },
  activated() {
    if (this.name !== this.$route.params.name) {
      this.refresh(this.$route.params.name);
    }
  },
  computed: {
    ...mapState(["mode", "playList", "songs", "currentIndex"]),
    ...mapGetters(["currentSong"])
  },
  beforeRouteUpdate(to, from, next) {
    this.refresh(to.params.name);
    next();
  },
  methods: {
    ...mapActions(["getSongs", "getCurrentIndex", "getPlayList", "setPlaying"]),
    scrollToBottom() {
      this.finished = false;
      if (this.count > (this.page - 1) * 20) {
        this.pullUp = true;
        this.getData(this.$route.params.name);
      }
    },
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
    getData(key) {
      let list;
      this.$fetch("/search", {
        keywords: key,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.songCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.songCount;
          }
          list = result.songs;
          this.page += 1;
        })
        .then(() => {
          let ids = [];
          list.forEach(item => ids.push(item.id));
          this.$fetch("/song/detail", { ids: ids.join(",") }).then(data => {
            this.songList = this.songList.concat(data.songs);
            this.$nextTick(() => {
              this.scrollHeight = this.$refs.result.scrollHeight;
            });
            let privileges = data.privileges,
              arr = data.songs,
              j = 0;
            for (let i = 0, len = privileges.length; i < len; i++) {
              if (privileges[i].st < 0) {
                arr.splice(i - j, 1);
                j++;
              }
            }
            arr.filter(item => {
              return item.fee !== 1;
            });
            this.list = this.list.concat(arr);
            if (this.loading) {
              this.loading = false;
            } else this.pullUp = false;
            this.finished = true;
          });
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
    toPlayer(item) {
      if (item.fee === 1) {
        this.text = "未登录/购买VIP";
        this.toast = true;
        return;
      }
      let notplay = false;
      this.$fetch("/song/detail", { ids: item.id })
        .then(data => {
          notplay = data.privileges[0].st < 0;
        })
        .then(
          () => {
            if (notplay) {
              this.text = "此音乐暂时无版权";
              this.toast = true;
              return;
            }
            let list = this.songs,
              index = 0;
            if (list.length <= 1) {
              list.push(item);
              index = list.length - 1;
            } else {
              let li = this.findNewIndex(list, this.currentSong.id);
              let i = this.findNewIndex(list, item.id);
              if (i < 0) {
                list.splice(li + 1, 0, item);
                index = li + 1;
              } else {
                if (li < i) {
                  list.splice(li + 1, 0, list.splice(i, 1)[0]);
                  index = li + 1;
                } else if (li > i) {
                  list.splice(li, 0, list.splice(i, 1)[0]);
                  index = li;
                } else {
                  index = li;
                }
              }
            }
            this.getSongs([...list]);
            let playList = [...list];
            if (this.mode === 1 && list.length > 2) {
              playList = this.shuffle([...list]);
              index = this.findNewIndex(playList, item.id);
            }
            this.getPlayList(playList);
            this.getCurrentIndex(index);
            this.setPlaying(true);
            this.$router.push({ name: "player" });
          },
          error => console.log(error)
        );
    },
    playAll() {
      this.getSongs([...this.list]);
      let index = 0;
      let playList = [...this.list];
      if (this.mode === 1 && this.list.length > 2) {
        playList = this.shuffle([...this.list]);
        index = this.findNewIndex(playList, this.list[0].id);
      }
      this.getPlayList(playList);
      this.getCurrentIndex(index);
      this.setPlaying(true);
      this.$router.push({ name: "player" });
    },
    refresh(key) {
      this.songList = [];
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.getData(key);
      this.name = key;
    },
    hide() {
      this.toast = false;
    }
  }
};
</script>

<style scoped>
.search-single {
  overflow-y: scroll;
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
  background: url("../../assets/img/any.png") left center no-repeat;
  background-size: 0.6rem;
}
.play-select {
  font-size: 0.373rem;
  padding-left: 0.5rem;
  background: url("../../assets/img/b2w1.png") left center no-repeat;
  background-size: 0.32rem 0.28rem;
}
</style>
