<template>
  <div id="app">
    <drawer :show.sync="showDrawer" show-mode="overlay">
      <div slot="drawer">
        <div style="width: 8.267rem;">
          <DrawerPage></DrawerPage>
        </div>
      </div>
      <div
        class="container"
        :style="{ height: mini ? 'calc(100vh - 1.333rem)' : '100vh' }"
      >
        <keep-alive :exclude="keepAlive">
          <router-view></router-view>
        </keep-alive>
        <audio
          ref="audio"
          @canplay="ready"
          @error="error"
          @timeupdate="updateTime"
          @ended="ended"
          :src="musicUrl"
        ></audio>
        <div
          class="mini-player"
          v-if="mini"
          :class="{ hide: miniOff }"
          @click="jumpToPlayer"
        >
          <div class="mini-left">
            <img class="mini-img" :src="currentSong.al.picUrl" alt="" />
            <div class="mini-text">
              <p>{{ currentSong.name }}</p>
              <span>{{ currentSong.ar[0].name }}</span>
            </div>
          </div>
          <div class="mini-right">
            <div class="progress-circle" @click.stop="changePlay">
              <svg
                :width="radius"
                :height="radius"
                viewBox="0 0 100 100"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="progress-background"
                  r="50"
                  cx="50"
                  cy="50"
                  fill="transparent"
                ></circle>
                <circle
                  class="progress-bar"
                  r="50"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  :stroke-dasharray="dashArray"
                  :stroke-dashoffset="dashOffset"
                ></circle>
              </svg>
              <span
                class="mini-played"
                :class="{ 'mini-pause': playing }"
              ></span>
            </div>
            <a class="mini-menu" @click.stop="open"></a>
          </div>
        </div>
      </div>
    </drawer>
    <popup class="popup" v-model="popup" :show-mask="false" height="10.667rem">
      <div class="popup-con">
        <div class="popup-title">
          <span @click="changeMode">
            <a
              class="icon"
              :class="{
                'icon-sequence': mode === 0,
                'icon-random': mode === 1,
                'icon-loop': mode === 2
              }"
            ></a>
            {{
              mode === 0
                ? "列表循环"
                : mode === 1
                ? "随机播放"
                : mode === 2
                ? "单曲循环"
                : ""
            }}({{ songs.length }})</span
          >
          <div class="title-right">
            <span><a class="icon icon-collect"></a>收藏全部</span>
            <a class="icon icon-delete" @click.stop="confirm = true"></a>
          </div>
        </div>
        <div class="vux-1px-b"></div>
        <div class="popup-list">
          <Wrapper class="popup-wrapper" ref="pWrapper">
            <ul class="content">
              <li
                ref="songItem"
                v-for="(item, index) in songs"
                :key="index"
                @click="setCurrent(item.id)"
              >
                <p
                  class="song-name"
                  :class="{ active: item.id === currentSong.id }"
                >
                  <a></a>{{ item.name }}<span> - {{ item.ar[0].name }}</span>
                </p>
                <a class="song-delete" @click.stop="del(item.id)"></a>
              </li>
            </ul>
          </Wrapper>
        </div>
      </div>
    </popup>
    <div
      class="overlayer"
      @touchmove.prevent
      v-show="popup"
      @click="popup = false"
    ></div>
    <div class="alert" v-transfer-dom>
      <Confirm v-model="confirm" title="确认" @on-confirm="delAll">
        <p style="text-align:center;">确认要删除当前播放列表吗？</p>
      </Confirm>
    </div>
  </div>
</template>

<script>
import { Drawer, Popup, TransferDom, Confirm } from "vux";
import bus from "@/utils/bus.js";
import Wrapper from "@/components/Wrapper";
import DrawerPage from "@/components/Drawer";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: {
    Drawer,
    DrawerPage,
    Popup,
    Wrapper,
    Confirm
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      musicUrl: "",
      currentTime: 0,
      radius: "0.8rem",
      percent: 0,
      dashArray: Math.PI * 100,
      songReady: false,
      duration: 0,
      popup: false,
      confirm: false,
      mini: false,
      miniOff: false,
      plist: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    };
  },
  created() {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", JSON.stringify([]));
    }
    this.setHistory(JSON.parse(localStorage.getItem("history")));
  },
  mounted() {
    if (this.songs.length > 0) {
      this.mini = true;
    }
    bus.$on("currentTime", data => {
      this.currentTime = data;
    });
    bus.$on("popup", () => this.open());
    bus.$on("changeMode", () => this.changeMode());
    bus.$on("loop", () => (this.$refs.audio.currentTime = 0));
  },
  destroyed() {
    bus.$off();
  },
  computed: {
    ...mapGetters(["currentSong"]),
    ...mapState([
      "list",
      "keepAlive",
      "currentIndex",
      "songs",
      "mode",
      "playList",
      "playing",
      "history"
    ]),
    showDrawer: {
      get() {
        return this.$store.state.drawerShow;
      },
      set() {
        return this.changeDrawer();
      }
    },
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  methods: {
    ...mapActions([
      "getTime",
      "getPlayList",
      "getMode",
      "getCurrentIndex",
      "getSongs",
      "setPlaying",
      "setHistory",
      "changeDrawer"
    ]),
    noScroll() {
      event.preventDefault();
    },
    ready() {
      this.songReady = true;
      this.duration = this.$refs.audio.duration;
      if (this.playing) {
        this.$refs.audio.play();
      }
    },
    error() {
      if (this.playing) {
        console.log("这首歌播放出现问题啦，现在切换到下一首");
        this.next();
      }
    },
    updateTime(e) {
      bus.$emit("current", e.target.currentTime);
      if (e.target.currentTime / this.duration) {
        this.percent = e.target.currentTime / this.duration;
      }
    },
    changePlay() {
      if (this.playing) {
        this.setPlaying(false);
      } else this.setPlaying(true);
    },
    ended() {
      if (this.mode === 2) {
        this.$refs.audio.currentTime = 0;
      } else {
        this.next();
      }
    },
    next() {
      const next = this.currentIndex + 1;
      const len = this.playList.length;
      if (len === 1) {
        this.$refs.audio.currentTime = 0;
      } else {
        if (next === len) {
          this.getCurrentIndex(0);
        } else this.getCurrentIndex(next);
      }
    },
    open() {
      this.popup = true;
      this.$nextTick(() => {
        this.$refs.pWrapper.refresh();
      });
      let lineEl = this.$refs.songItem[this.currentIndex - 3];
      this.$refs.pWrapper.scrollToElement(lineEl, 0);
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
    changeMode() {
      let arr = [...this.songs],
        playList;
      if (this.mode === 0 && this.songs.length > 0) {
        this.getMode(1);
        playList = this.shuffle(arr);
      } else if (this.mode === 1) {
        this.getMode(2);
        playList = arr;
      } else {
        this.getMode(0);
        playList = arr;
      }
      let index = this.findNewIndex(playList, this.currentSong.id);
      this.getPlayList(playList);
      this.getCurrentIndex(index);
    },
    setCurrent(id) {
      let index = this.playList.findIndex(item => {
        return item.id === id;
      });
      this.getCurrentIndex(index);
    },
    del(id) {
      let list = [...this.songs];
      let playList = [...this.playList];
      let index = this.currentIndex;
      let li = this.findNewIndex(list, id);
      let pi = this.findNewIndex(playList, id);
      list.splice(li, 1);
      playList.splice(pi, 1);
      if (pi < index) {
        index--;
      }
      if (index === playList.length) {
        index = 0;
      }
      this.getSongs(list);
      this.getPlayList(playList);
      this.getCurrentIndex(index);
    },
    delAll() {
      this.setPlaying(false);
      this.musicUrl = "";
      if (this.$route.name === "player") {
        this.$router.go(-1);
      }
      let list = [];
      this.popup = false;
      this.getSongs(list);
      this.getPlayList(list);
    },
    jumpToPlayer() {
      this.$router.push({ name: "player" });
    },
    delConfirm() {
      const _this = this;
      this.$vux.confirm.show({
        title: "确认",
        content: "确认要删除播放列表吗？",
        onConfirm() {
          _this.setPlaying(false);
          _this.musicUrl = "";
          if (_this.$route.name === "player") {
            _this.$router.go(-1);
          }
          let list = [];
          _this.popup = false;
          _this.getSongs(list);
          _this.getPlayList(list);
        }
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  },
  watch: {
    $route(e) {
      this.miniOff = e.name === "player";
    },
    playing(val) {
      if (!val) {
        this.$refs.audio.pause();
      }
      if (this.songReady && val) {
        this.$refs.audio.play();
      }
    },
    songReady(val) {
      if (val && this.playing) {
        this.$refs.audio.play();
      }
    },
    currentTime(val) {
      this.$refs.audio.currentTime = val;
    },
    duration(val) {
      this.getTime(val);
    },
    currentSong(val, oVal) {
      if (!val.id || val.id < 0) return;
      if (val !== oVal) {
        this.songReady = false;
        this.$fetch("/song/url", { id: val.id })
          .then(data => {
            if (data.data[0].url.length > 0) {
              this.musicUrl = data.data[0].url;
              let arr = JSON.parse(localStorage.getItem("history"));
              let index = arr.findIndex(item => {
                return item.id === val.id;
              });
              if (index >= 0) {
                arr.splice(index, 1);
              } else if (arr.length === 100) {
                arr.splice(99, 1);
              }
              arr.unshift(this.currentSong);
              localStorage.setItem("history", JSON.stringify(arr));
              this.setHistory(arr);
            } else {
              console.log("这首歌播放出现问题啦，现在切换到下一首");
              this.next();
            }
          })
          .catch(err => {
            console.log(err);
            console.log("这首歌播放出现问题啦，现在切换到下一首");
            this.next();
          });
      }
    },
    songs(val) {
      this.mini = val.length > 0;
    }
  }
};
</script>

<style>
.alert .weui-dialog__btn_primary {
  color: #ce3d3a;
}
#app .vux-popup-dialog {
  background: transparent;
}
</style>
<style lang="less">
@import "~vux/src/styles/1px.less";
.overlayer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  background-color: #000;
  opacity: 0.5;
}
body {
  overflow: hidden;
}
a {
  -webkit-tap-highlight-color: transparent;
}
#app {
  width: 100%;
  height: 100%;
  touch-action: none;
  font-family: SourceHanSans;
}
.fade-enter-active {
  transition: transform 50ms;
  transform-origin: bottom;
  transform: scaleY(1);
}
.fade-leave-active {
  transition: transform 50ms;
  transform-origin: bottom;
  transform: scaleY(0);
}
.fade-enter {
  transform: scaleY(0);
}
.fade-leave {
  transform: scaleY(1);
}
.container {
  width: 100vw;
  height: 100vh;
}
.mini-player,
.mini-left,
.mini-right {
  display: flex;
  align-items: center;
}
.mini-player {
  position: sticky;
  bottom: 0;
  height: 1.333rem;
  width: 100%;
  background: #fff;
  z-index: 100;
  justify-content: space-between;
}
.hide {
  display: none;
}
.mini-img {
  height: 1.067rem;
  width: 1.067rem;
  border-radius: 50%;
  margin: 0 0.16rem;
}
.mini-text {
  line-height: 1.4;
  p {
    width: 6rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #666;
    font-size: 0.4rem;
  }
  span {
    color: #999;
    font-size: 0.32rem;
  }
}
.progress-circle {
  position: relative;
  margin-top: 0.053rem;
  circle {
    stroke-width: 0.08rem;
    transform-origin: center;
  }
  .progress-background {
    transform: scale(0.9);
    stroke: #666;
  }
  .progress-bar {
    transform: scale(0.9) rotate(-90deg);
    stroke: #ce3d3a;
  }
}
.mini-played,
.mini-pause {
  display: block;
  background: url("assets/img/note_btn_play_ms.png") center no-repeat;
  height: 0.56rem;
  width: 0.56rem;
  background-size: 0.6rem 0.6rem;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -0.32rem;
  margin-left: -0.26rem;
}
.mini-pause {
  background: url("assets/img/note_btn_pause_ms.png") center no-repeat;
  background-size: 0.6rem 0.6rem;
}
.mini-menu {
  display: block;
  margin-right: 0.133rem;
  margin-left: 0.267rem;
  background: url("assets/img/b251.png") center no-repeat;
  height: 1.2rem;
  width: 1.2rem;
  background-size: 1.2rem 1.2rem;
}
.popup {
  font-size: 0.427rem;
  font-family: SourceHanSans;
}
.vux-popup-dialog {
  overflow-y: inherit;
}
.popup-con {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0.667rem 0.667rem 0 0;
}
.popup-title,
.popup-list li {
  height: 1.333rem;
  padding: 0 0.266rem 0 0.333rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popup-list {
  height: 9.333rem;
  overflow: hidden;
}
.popup-list span {
  color: #a3a3a3;
  font-size: 0.32rem;
}
.popup-list .song-name {
  width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.popup-list .active,
.popup-list .active span {
  color: #ff2e56;
}
.icon,
.song-delete,
.popup-list .active a {
  display: inline-block;
  vertical-align: bottom;
  margin-right: 0.067rem;
  margin-bottom: -0.04rem;
  height: 0.733rem;
  width: 0.733rem;
  background-size: 0.733rem 0.733rem;
  background-repeat: no-repeat;
  background-position: center;
}
.popup-list .active a {
  background-image: url("assets/img/ah1.png");
  background-size: 0.65rem 0.65rem;
}
.icon-sequence {
  background-image: url("assets/img/b1g1.png");
}
.icon-random {
  background-image: url("assets/img/b221.png");
}
.icon-loop {
  background-image: url("assets/img/b1o1.png");
}
.icon-collect {
  background-image: url("assets/img/an2.png");
  background-size: 0.65rem 0.65rem;
}
.icon-delete {
  margin-right: 0;
  margin-left: 0.533rem;
  background-image: url("assets/img/note_rdi_btn_dlt_white.png");
  background-size: 0.58rem 0.58rem;
}
.song-delete {
  margin-right: 0;
  background-image: url("assets/img/a7j.png");
  background-size: 0.5rem 0.5rem;
}
</style>
