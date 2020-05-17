<template>
  <div class="player-page" @mousewheel.prevent>
    <div class="bg-con">
      <div class="page-bg">
        <div class="filter"></div>
        <div
          class="bg"
          :style="{ backgroundImage: 'url(' + currentSong.al.picUrl + ')' }"
        ></div>
      </div>
    </div>
    <div class="player-container">
      <TopNav ref="top">
        <div class="top-left">
          <div class="top-title">
            <div class="top-text">
              <p>{{ currentSong.name }}</p>
            </div>
            <span>{{ currentSong.ar[0].name }}</span>
          </div>
        </div>
        <div class="top-right">
          <a><img src="../assets/img/an8.png"/></a>
        </div>
      </TopNav>
      <div class="player" :style="{ opacity: lycShow ? 0 : 1 }" @click="show">
        <div class="stylus" :class="{ 'stylus-rotate': !playing }">
          <img class="stylus-img" src="../assets/img/b2_.png" />
        </div>
        <div class="player-con">
          <div
            class="player-bg"
            :class="[{ 'player-run': hasChange, 'player-pause': !playing }]"
          >
            <img class="player-img" :src="currentSong.al.picUrl" />
          </div>
        </div>
      </div>
      <div class="no-lyc" v-if="noLyric" :class="{ 'lyc-hide': !lycShow }">
        {{ noLyricText }}
      </div>
      <div
        class="lyc"
        ref="lyc"
        :class="{ 'lyc-hide': !lycShow }"
        @click.stop="show"
      >
        <Wrapper class="lyc-wrapper" ref="wrapper">
          <div class="content">
            <p
              ref="lyricLine"
              v-for="(item, index) in lyric"
              :class="{ current: currentLine === index }"
              :key="index"
            >
              {{ item.text ? item.text : "" }}
            </p>
          </div>
        </Wrapper>
      </div>
      <div class="player-bottom" :style="{ zIndex: lycShow ? 0 : 2 }">
        <div class="player-icons" :style="{ opacity: lycShow ? 0 : 1 }">
          <a
            v-for="(item, i) in icons"
            class="icon"
            :class="{ liked: i === 0 && animated }"
            @click.stop="toggleLiked(i)"
            :key="i"
            :style="{
              backgroundImage:
                i === 0 && liked.includes(currentSong.id)
                  ? 'url(' + require('../assets/img/b1k.png') + ')'
                  : 'url(' + item + ')'
            }"
          ></a>
        </div>
        <div class="player-control">
          <div class="player-progress">
            <div class="current">{{ format(currentTime) }}</div>
            <div
              class="progress"
              ref="progress"
              @touchstart.prevent="progressTouchStart"
              @touchmove.prevent="progressTouchMove"
              @touchend="progressTouchEnd"
            >
              <div class="progress-inner">
                <div class="progress-bar" ref="progressBar"></div>
                <div class="progress-btn" ref="progressBtn"></div>
              </div>
            </div>
            <div class="total">{{ format(totalTime) }}</div>
          </div>
          <div class="control-button">
            <div class="btn-group">
              <a class="change" @click="changeMode"
                ><img
                  class="btn-icon"
                  :src="
                    mode === 0
                      ? require('../assets/img/b1g.png')
                      : mode === 1
                      ? require('../assets/img/b22.png')
                      : mode === 2
                      ? require('../assets/img/b1o.png')
                      : ''
                  "
              /></a>
              <a class="pre" @click="pre"
                ><img class="btn-icon" src="../assets/img/b08.png" alt=""
              /></a>
            </div>
            <a class="play" @click="toPlay" v-show="!playing"
              ><img class="btn-icon-big" src="../assets/img/b06.png" alt=""
            /></a>
            <a class="pause" @click="toPause" v-show="playing"
              ><img class="btn-icon-big" src="../assets/img/b04.png" alt=""
            /></a>
            <div class="btn-group">
              <a class="next" @click="next"
                ><img class="btn-icon" src="../assets/img/b02.png" alt=""
              /></a>
              <a class="menu" @click="openPopup"
                ><img class="btn-icon" src="../assets/img/b25.png" alt=""
              /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wrapper from "@/components/Wrapper";
import bus from "@/utils/bus.js";
import { mapState, mapGetters, mapActions } from "vuex";
import TopNav from "../components/TopNav";

export default {
  name: "Player",
  components: {
    Wrapper,
    TopNav
  },
  data() {
    return {
      list: [],
      activeIndex: 1,
      swiperOption: {
        initialSlide: 1,
        lazyLoading: true,
        shortSwipes: false,
        touchRatio: 0.7,
        resistanceRatio: 0,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        touchMoveStopPropagation: false
      },
      current: 0,
      paused: true,
      hasChange: true,
      icons: [
        require("../assets/img/b1i.png"),
        require("../assets/img/b17.png"),
        require("../assets/img/b0y.png"),
        require("../assets/img/b0j.png"),
        require("../assets/img/b1m.png")
      ],
      lycShow: false,
      lyric: [],
      noLyric: false,
      noLyricText: "暂无歌词",
      // blankLine: 0,
      currentLine: 0,
      touchX: 0,
      currentTime: 0,
      touched: false,
      animated: false
    };
  },
  computed: {
    swiper() {
      return this.$refs.player.swiper;
    },
    ...mapState({
      curIndex: state => state.currentIndex,
      totalTime: state => state.duration,
      playlist: "playList",
      playing: state => state.playing,
      mode: "mode",
      liked: "liked",
      likeList: "likeList"
    }),
    ...mapGetters(["currentSong"])
  },
  mounted() {
    bus.$on("current", data => {
      if (!this.touched) {
        this.currentTime = Math.floor(data);
        const percent = this.currentTime / this.totalTime;
        const barWidth = this.$refs.progress.offsetWidth;
        const offsetWidth = percent * barWidth;
        this.$refs.progressBar.style.width = offsetWidth + "px";
        this.$refs.progressBtn.style.left = offsetWidth - 4 + "px";
      }
    });
    this.fetchLyric();
  },
  activated() {
    if (this.noLyric || this.lyric.length <= 0) return;
    this.$nextTick(() => {
      this.$refs.wrapper.refresh();
      let lineEl = this.$refs.lyricLine[this.currentLine];
      this.$refs.wrapper.scrollToElement(lineEl, 0);
    });
  },
  methods: {
    ...mapActions(["getCurrentIndex", "setPlaying", "setLiked", "setLikeList"]),
    show() {
      this.lycShow = !this.lycShow;
    },
    toPlay() {
      this.setPlaying(true);
    },
    toPause() {
      this.setPlaying(false);
    },
    toggleLiked(i) {
      if (i !== 0) return;
      let arr1 = JSON.parse(localStorage.getItem("liked"));
      let arr2 = JSON.parse(localStorage.getItem("likeList"));
      if (arr1.includes(this.currentSong.id)) {
        let index = arr1.findIndex(item => {
          return item === this.currentSong.id;
        });
        arr1.splice(index, 1);
        arr2.splice(index, 1);
      } else {
        arr1.unshift(this.currentSong.id);
        arr2.unshift(this.currentSong);
      }
      localStorage.setItem("liked", JSON.stringify(arr1));
      localStorage.setItem("likeList", JSON.stringify(arr2));
      this.setLiked(arr1);
      this.setLikeList(arr2);
      this.animated = true;
      setTimeout(() => {
        this.animated = false;
      }, 500);
    },
    getLyric(lyc) {
      let lyric = lyc;
      let arr = [],
        lrcArr = [],
        lrcArr2 = [],
        n = 0;
      arr = lyric.split("\n");
      arr.map((item, i) => {
        let index = arr[i].indexOf("]");
        let index2 = arr[i].indexOf("]", index + 1);
        if (index2 < 0) {
          let time = arr[i].slice(1, index);
          let text = arr[i].slice(index + 1);
          if (text.length <= 0) {
            n = n + 1;
            return;
          }
          if (lrcArr2.length > 0) {
            lrcArr = lrcArr.concat(lrcArr2);
            lrcArr2 = [];
          }
          this.handleLyric(time, text, lrcArr);
        } else {
          let time = arr[i].slice(1, index);
          let text = arr[i].slice(index2 + 1);
          let time2 = arr[i].slice(index + 2, index2);
          if (text.length <= 0) {
            n = n + 1;
            return;
          }
          this.handleLyric(time2, text, lrcArr);
          this.handleLyric(time, text, lrcArr2);
          if (i === arr.length - 1 - n) {
            lrcArr = lrcArr.concat(lrcArr2);
            lrcArr2 = [];
          }
        }
      });
      this.lyric = lrcArr;
    },
    handleLyric(time, text, arr) {
      let min = parseInt(time.split(":")[0]);
      let ms = parseFloat(time.split(":")[1]) * 1000;
      if (min > 0) {
        ms = min * 60 * 1000 + ms;
      }
      let obj = {
        time: time.slice(0, 5),
        ms: ms,
        text: text
      };
      arr.push(obj);
      return arr;
    },
    progressTouchStart(e) {
      this.touched = true;
      const x = e.touches[0].pageX;
      const left = this.$refs.progress.offsetLeft;
      const barWidth = this.$refs.progress.offsetWidth;
      if (x <= left) {
        this.$refs.progressBar.style.width = 0;
        this.$refs.progressBtn.style.left = -4 + "px";
      } else if (x >= barWidth + left) {
        this.$refs.progressBar.style.width = barWidth + "px";
        this.$refs.progressBtn.style.left = barWidth - 4 + "px";
      } else {
        this.$refs.progressBar.style.width = x - left + "px";
        this.$refs.progressBtn.style.left = x - left - 4 + "px";
      }
      this.getCurrent();
    },
    progressTouchMove(e) {
      const x = e.touches[0].pageX;
      const barWidth = this.$refs.progress.offsetWidth;
      const left = this.$refs.progress.offsetLeft;
      let offsetWidth = Math.min(barWidth, Math.max(0, x - left));
      this.$refs.progressBar.style.width = offsetWidth + "px";
      this.$refs.progressBtn.style.left = offsetWidth - 4 + "px";
      this.getCurrent();
    },
    progressTouchEnd() {
      this.touched = false;
      bus.$emit("currentTime", this.currentTime);
    },
    getCurrent() {
      const barWidth = this.$refs.progress.offsetWidth;
      const width = this.$refs.progressBar.offsetWidth;
      this.currentTime = Math.floor((width / barWidth) * this.totalTime);
    },
    format(time) {
      let minute = Math.floor(time / 60) % 60;
      let sec = Math.floor(time % 60);
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return `${minute}:${sec}`;
    },
    next() {
      this.hasChange = false;
      const next = this.curIndex + 1;
      const len = this.playlist.length;
      if (len === 1) {
        bus.$emit("loop");
      } else {
        if (next === len) {
          this.getCurrentIndex(0);
        } else this.getCurrentIndex(next);
        this.$refs.wrapper.scrollToElement(this.$refs.lyricLine[0], 0);
      }
      setTimeout(() => {
        this.hasChange = true;
      }, 1000);
    },
    pre() {
      this.hasChange = false;
      const pre = this.curIndex - 1;
      const len = this.playlist.length;
      if (len === 1) {
        bus.$emit("loop");
      } else {
        if (pre === -1) {
          this.getCurrentIndex(len - 1);
        } else this.getCurrentIndex(pre);
        this.$refs.wrapper.scrollToElement(this.$refs.lyricLine[0], 0);
      }
      setTimeout(() => {
        this.hasChange = true;
      }, 1000);
    },
    del(index) {
      this.playlist.splice(1, 1);
      this.getCurrentIndex(index - 1);
    },
    openPopup() {
      bus.$emit("popup");
    },
    changeMode() {
      bus.$emit("changeMode");
    },
    fetchLyric() {
      this.$fetch("/lyric", { id: this.currentSong.id })
        .then(data => {
          if (data.nolyric) {
            this.lyric = [];
            this.noLyric = true;
            this.noLyricText = "纯音乐，无歌词";
            return;
          }
          if (data.lrc.lyric.length <= 0 || !data.lrc) {
            this.lyric = [];
            this.noLyricText = "暂时没有歌词";
            this.noLyric = true;
            return;
          }
          this.getLyric(data.lrc.lyric);
        })
        .catch(err => {
          console.log(err);
          this.lyric = [];
          this.noLyricText = "暂时没有歌词";
          this.noLyric = true;
        });
    }
  },
  watch: {
    currentTime(val) {
      if (this.lyric.length <= 0) return;
      let line = this.lyric.findIndex(e => {
        if (e.ms) {
          let time = e.ms;
          return time > val * 1000 + 1000;
        }
      });
      if (line === -1) {
        let len = this.lyric.length;
        let lastTime = this.lyric[len - 1].ms;
        if (lastTime <= val * 1000 + 1000) {
          line = len;
        }
      }
      this.currentLine = line - 1;
    },
    currentLine(val) {
      if (this.noLyric) return;
      let lineEl = this.$refs.lyricLine[val];
      this.$refs.wrapper.scrollToElement(lineEl, 1000);
    },
    currentSong(val, oVal) {
      if (!val.id || val.id < 0) return;
      if (val !== oVal) {
        this.fetchLyric();
      }
    }
  }
};
</script>

<style scoped lang="less">
.lyc {
  z-index: 1;
  width: 100%;
  height: calc(100vh - 5.2rem);
  position: absolute;
  top: 1.867rem;
  .lyc-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 0.267rem;
    overflow: hidden;
  }
  p {
    text-align: center;
    color: #ccc;
    font-size: 0.427rem;
    margin: 0.4rem 0;
  }
  .current {
    color: #fff;
  }
}
.lyc-hide {
  opacity: 0;
}
.no-lyc {
  position: absolute;
  margin-top: -1.8rem;
  top: 50%;
  left: 0;
  right: 0;
  color: #ccc;
  font-size: 0.427rem;
  text-align: center;
}
.player-page {
  height: 100vh;
  overflow: hidden;
}
.bg-con {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.page-bg {
  filter: blur(30px);
  transform: scale(1.2);
  opacity: 0.6;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.6;
  }
  .bg {
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
  }
}
.top-nav,
.top-left,
.top-right,
.creator {
  display: flex;
  align-items: center;
}
.top-nav {
  justify-content: space-between;
  height: 1.467rem;
  width: 100%;
  position: relative;
  z-index: 10;
  a {
    display: block;
    height: 1.467rem;
    line-height: 1.467rem;
    width: 1.333rem;
    text-align: center;
    img {
      vertical-align: middle;
      height: 0.667rem;
      width: 0.667rem;
    }
  }
}
.top-left,
.top-title {
  flex: 1;
}
.top-left a {
  margin: 0 0.133rem;
}
.top-title {
  p {
    width: 7rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
    font-size: 0.467rem;
    line-height: 0.48rem;
    margin-top: 0.05rem;
  }
  span {
    color: #bbb;
    font-size: 0.347rem;
  }
}
.top-text {
  position: relative;
  height: 0.6rem;
}
.player-container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.player {
  position: relative;
  flex: 1;
}
.player-con {
  width: 100vw;
}
.stylus {
  position: absolute;
  top: 0.65rem;
  left: 50vw;
  z-index: 10;
  transition: transform 750ms;
  transform-origin: 0.427rem 0.427rem;
  transform: rotate(0deg);
}
.stylus-rotate {
  transform: rotate(-25deg);
}
.stylus-img {
  height: 3.6rem;
  width: 2.4rem;
}
.player-bg {
  background: url("../assets/img/b0h.png") no-repeat;
  background-size: 7.333rem 7.333rem;
  margin: 2.4rem auto 0;
  height: 7.333rem;
  width: 7.333rem;
  text-align: center;
  line-height: 7.333rem;
}
.player-img {
  border-radius: 50%;
  height: 4.933rem;
  width: 4.933rem;
  vertical-align: middle;
}
@-webkit-keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.player-run {
  animation: rotate 25s linear infinite;
}
.player-pause {
  animation-play-state: paused;
}
.player-bottom {
  height: 4.4rem;
}
.player-icons,
.control-button,
.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.player-icons {
  width: 8rem;
  margin: 0 auto 0.667rem auto;
}
.icon {
  width: 0.8rem;
  height: 0.8rem;
  background-size: 0.8rem 0.8rem;
  background-repeat: no-repeat;
}
.player-control {
  height: 2.667rem;
}
.player-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.4rem;
}
.current,
.total {
  font-size: 0.293rem;
}
.current {
  color: #fff;
}
.total {
  color: #ccc;
}
.progress {
  padding: 0.133rem 0;
  width: 7.2rem;
  position: relative;
}
.progress-inner {
  width: 100%;
  height: 2px;
  background: #a1a1a1;
  border-radius: 10px;
  position: relative;
}
.progress-bar {
  position: absolute;
  height: 2px;
  width: 0;
  background: #ccc;
  border-radius: 10px;
}
.progress-btn {
  position: absolute;
  width: 8px;
  height: 8px;
  left: -4px;
  top: -3px;
  border-radius: 50%;
  background: #fff;
}
.control-button {
  width: 8rem;
  margin: 0.4rem auto;
}
.btn-group {
  width: 2.667rem;
}
.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}
.btn-icon-big {
  width: 1.76rem;
  height: 1.76rem;
}
.liked {
  animation: liked 500ms;
}
@keyframes liked {
  0% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.3);
  }
  80% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
}
</style>
