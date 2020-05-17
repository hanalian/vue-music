<template>
  <div>
    <div class="nav">
      <a class="drawer" @click="$store.dispatch('changeDrawer')"></a>
      <ul>
        <li
          v-for="(name, index) in nav"
          :key="index"
          :class="{ active: index === tabIndex }"
          @click="tabChange(index)"
        >
          {{ name }}
        </li>
      </ul>
      <a class="search" @click="jump"></a>
    </div>
    <div class="home">
      <swiper :options="swiperOption" ref="mainSwiper" class="main">
        <swiper-slide
          v-for="(item, index) in views"
          :key="index"
          :style="{
            height:
              $store.state.songs.length > 0
                ? 'calc(100vh - 2.8rem)'
                : 'calc(100vh - 1.333rem)'
          }"
        >
          <component :is="item"></component>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";

import { swiper, swiperSlide } from "vue-awesome-swiper";
import My from "./My";
import Find from "./Find";
import Friend from "./Friend";

export default {
  name: "home",
  components: {
    swiper,
    swiperSlide,
    My,
    Find,
    Friend
  },
  data() {
    return {
      isMounted: false,
      screenWidth: document.body.clientWidth,
      nav: ["我的", "发现", "朋友", "视频"],
      views: [My, Find, Friend, Friend],
      tabIndex: 1,
      dragging: false,
      sliderX: 0,
      url: "",
      styles: {
        fontSize: 18
      },
      swiperOption: {
        initialSlide: 1,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        touchAngle: 15,
        resistanceRatio: 0,
        threshold: 20,
        noSwiping: true,
        noSwipingClass: "stop-swiping",
        shortSwipes: false,
        autoHeight: true,
        touchMoveStopPropagation: true
      },
      radius: "0.32rem",
      percent: 0.3,
      dashArray: Math.PI * 100
    };
  },
  mounted() {
    this.isMounted = true;
    this.$store.dispatch("setKeepAlive", ["Search"]);
    if (!localStorage.getItem("liked")) {
      localStorage.setItem("liked", JSON.stringify([]));
    }
    if (!localStorage.getItem("likeList")) {
      localStorage.setItem("likeList", JSON.stringify([]));
    }
    this.$store.dispatch("setLiked", JSON.parse(localStorage.getItem("liked")));
    this.$store.dispatch(
      "setLikeList",
      JSON.parse(localStorage.getItem("likeList"))
    );
  },
  computed: {
    swiper() {
      return this.$refs.mainSwiper.swiper;
    },
    listen() {
      if (!this.isMounted) {
        return null;
      }
      return this.swiper.progress;
    },
    playing() {
      return this.$store.state.playing;
    }
  },
  watch: {
    listen(n) {
      switch (n) {
        case 0:
          this.tabIndex = 0;
          break;
        case 1 / 3:
          this.tabIndex = 1;
          break;
        case 2 / 3:
          this.tabIndex = 2;
          break;
        case 1:
          this.tabIndex = 3;
          break;
      }
    }
  },
  methods: {
    tabChange(index) {
      this.swiper.slideTo(index, 500, false);
    },
    jump() {
      this.$store.dispatch("setKeepAlive", []);
      this.$router.push({ path: "/search" });
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  position: sticky;
  width: 100%;
  height: 1.467rem;
  background: #fff;
  top: 0;
  z-index: 100;
}
.drawer,
.search {
  display: block;
  position: absolute;
  width: 1.333rem;
  height: 1.467rem;
  background: url("../assets/img/menu.png") center 0.52rem no-repeat;
  background-size: 0.5rem;
}
.search {
  top: 0;
  right: 0;
  background: url("../assets/img/search.png") center no-repeat;
  background-size: 0.5rem;
}
ul {
  text-align: center;
  line-height: 1.467rem;
  li {
    font-size: 0.427rem;
    display: inline-block;
    margin: 0 0.293rem;
    color: #999;
    transition: all 100ms;
  }
  .active {
    font-weight: 600;
    font-size: 0.48rem;
    color: #333;
  }
}
</style>
