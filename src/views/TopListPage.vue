<template>
  <ResultPage
    page="top"
    :finished="finished"
    @top="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    :pageName="name"
  >
    <div ref="top">
      <div
        class="top-bg"
        v-if="toplist[active]"
        :style="{
          backgroundImage: 'url(' + toplist[active].coverImgUrl + ')'
        }"
      >
        <div class="filter"></div>
      </div>
      <div
        class="swiper-con"
        v-if="$route.params.name === '推荐'"
        @touchmove.stop="touchmove"
        @touchstart.stop="touchstart"
        @touchend.stop="touchend"
      >
        <div
          class="swiper-item"
          v-for="(item, index) in toplist"
          :key="index"
          :class="{
            'swiper-active': index === active,
            'swiper-pre': index === pre,
            'swiper-next': index === next
          }"
          :style="{
            transform: `translate3d(${
              index === active ? activeX : index === pre ? preX : nextX
            }rem, 0, ${
              index === active ? activeZ : index === pre ? preZ : nextZ
            }rem)`,
            opacity:
              index === active
                ? opacityActive
                : index === pre
                ? opacityPre
                : opacityNext,
            transitionDuration: duration + 'ms'
          }"
          @click.stop="getActive(index)"
        >
          <img :src="item.coverImgUrl" alt="" class="swiper-img" />
          <div class="swiper-text">{{ item.name }}</div>
          <span class="play-count">{{ numberFormat(item.playCount) }}</span>
        </div>
      </div>
      <div class="play-list">
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
    </div>
  </ResultPage>
</template>

<script>
import ResultPage from "@/components/ResultPage";
import "swiper/dist/css/swiper.css";

export default {
  name: "TopListPage",
  components: { ResultPage },
  data() {
    return {
      finished: false,
      notfound: false,
      loading: true,
      pullUp: false,
      page: 1,
      count: 0,
      scrollHeight: 0,
      toplist: [],
      playlists: [],
      duration: 300,
      active: 0,
      pre: 2,
      next: 1,
      startX: 0,
      activeX: 0,
      activeZ: 0,
      preX: -2.8,
      preZ: -3,
      nextX: 2.8,
      nextZ: -3,
      opacityActive: 1,
      opacityPre: 0.5,
      opacityNext: 0.5,
      startTime: 0,
      before: 0,
      name: ""
    };
  },
  activated() {
    if (this.name !== this.$route.params.name) {
      this.getList();
      this.name = this.$route.params.name;
    }
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
    touchstart(e) {
      let date = new Date();
      this.startTime = date.getTime();
      this.startX = e.touches[0].pageX;
    },
    touchmove(e) {
      let diff = e.touches[0].pageX - this.startX;
      let x = (diff * 0.5) / 75;
      let z = diff / (2.8 * 75);
      this.duration = 0;
      if (Math.abs(x) < 2.7) {
        if (diff > 0) {
          this.activeX = x;
          this.activeZ = 0 - z;
          this.preX = -2.8 + x;
          this.preZ = -3 + z;
          this.nextX = 2.8 - 2 * x;
          this.opacityActive = 1 - (x / 2.8) * 0.5;
          this.opacityPre = 0.5 + (x / 2.8) * 0.5;
        } else {
          this.activeX = x;
          this.activeZ = z;
          this.preX = -2.8 - 2 * x;
          this.nextX = 2.8 + x;
          this.nextZ = -3 - z;
          this.opacityActive = 1 + (x / 2.8) * 0.5;
          this.opacityNext = 0.5 - (x / 2.8) * 0.5;
        }
      }
    },
    touchend(e) {
      let date = new Date();
      this.duration = 300;
      this.activeX = 0;
      this.activeZ = 0;
      this.preX = -2.8;
      this.preZ = -3;
      this.nextX = 2.8;
      this.nextZ = -3;
      this.opacityActive = 1;
      this.opacityPre = 0.5;
      this.opacityNext = 0.5;
      let diff = e.changedTouches[0].pageX - this.startX;
      if (Math.abs(diff) < 20) return;
      if (date.getTime() - this.startTime < 400 || Math.abs(diff / 75) > 2.8) {
        e.changedTouches[0].pageX > this.startX ? this.toPre() : this.toNext();
      }
    },
    toPre() {
      this.active = this.active === 0 ? 2 : this.active - 1;
      this.pre = this.pre === 0 ? 2 : this.pre - 1;
      this.next = this.next === 0 ? 2 : this.next - 1;
    },
    toNext() {
      this.active = this.active === 2 ? 0 : this.active + 1;
      this.pre = this.pre === 2 ? 0 : this.pre + 1;
      this.next = this.next === 2 ? 0 : this.next + 1;
    },
    getActive(i) {
      if (this.active === i) {
        this.toDetail(this.toplist[i]);
      } else {
        this.active = i;
        this.pre = i === 0 ? 2 : i - 1;
        this.next = i === 2 ? 1 : i + 1;
      }
    },
    toDetail(item) {
      // this.$store.dispatch("setKeepAlive", []);
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
    getList() {
      let url =
        this.$route.params.name === "精品"
          ? "/top/playlist/highquality"
          : "/top/playlist";
      let cat =
        this.$route.params.name === "精品" || this.$route.params.name === "推荐"
          ? ""
          : this.$route.params.name;
      let params =
        this.$route.params.name === "精品"
          ? {
              limit: 30,
              before: this.before
            }
          : {
              limit: 30,
              offset: (this.page - 1) * 30,
              cat: cat
            };
      this.$fetch(url, params)
        .then(data => {
          let playlists = data.playlists;
          this.count = data.total;
          if (this.$route.params.name === "推荐" && this.toplist.length === 0) {
            this.toplist = playlists.splice(0, 3);
          }
          if (this.$route.params.name === "精品") {
            this.before = playlists[playlists.length - 1].updateTime;
          }
          this.playlists = this.playlists.concat(playlists);
          this.$nextTick(() => {
            this.scrollHeight = this.$refs.top.scrollHeight;
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
    }
  }
};
</script>

<style scoped lang="less">
.top {
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
}
.top-bg {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  background-attachment: fixed;
  filter: blur(30px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  opacity: 0.3;
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.5;
  }
}
.swiper-img {
  width: 4.467rem;
  height: 4.467rem;
  display: block;
  position: relative;
}
.swiper-text {
  height: 1.533rem;
  width: 4.467rem;
  background: #fff;
  box-sizing: border-box;
  padding: 0.2rem 0.267rem;
  font-size: 0.373rem;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.swiper-con {
  display: flex;
  align-items: center;
  transform-style: preserve-3d;
  perspective: 1200px;
  width: 9.173rem;
  height: 6rem;
  margin: 0.4rem auto 0.6rem auto;
  position: relative;
}
.swiper-item {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
  border-radius: 0.12rem;
  position: absolute;
  left: 50%;
  margin-left: -2.233rem;
  transform: translate3d(0, 0, 0);
  transition-property: all;
  transition-duration: 300ms;
  overflow: hidden;
}
.swiper-item:before {
  content: "";
  display: block;
  position: absolute;
  right: 0.24rem;
  top: 3.333rem;
  width: 0.933rem;
  height: 0.933rem;
  background: url("../assets/img/play1.png") no-repeat;
  background-size: 0.933rem;
  z-index: 5;
}
.swiper-active {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.swiper-pre {
  transform: translate3d(-2.8rem, 0, -3rem);
  opacity: 0.5;
}
.swiper-next {
  transform: translate3d(2.8rem, 0, -3rem);
  opacity: 0.5;
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
