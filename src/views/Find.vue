<template>
  <div class="find" ref="find" @scroll="scrollHandler">
    <div class="content">
      <div class="banner">
        <swiper
          :options="swiperOption"
          v-if="banner.length"
          class="bannerSwiper"
        >
          <swiper-slide v-for="(item, index) in banner" :key="index">
            <img :src="item" alt="" class="banner-img" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="icons">
        <a
          v-for="(item, index) in icons"
          :key="index"
          @click="toPage(item.url)"
        >
          <img :src="item.src" alt="" />
          <p class="icon-text">{{ item.text }}</p>
        </a>
      </div>
      <div class="vux-1px-b"></div>
      <Loading v-if="loading" style="margin-top: 0.8rem"></Loading>
      <div v-if="!loading">
        <div class="recommend">
          <div class="find-title">
            <h2>推荐歌单</h2>
            <a class="goto" @click="toPage('/topList/推荐')">歌单广场</a>
          </div>
          <div class="list">
            <div
              v-for="(item, index) in list"
              :key="index"
              @click="toDetail(item)"
              class="list-item"
            >
              <img :src="item.picUrl" alt="" />
              <p>{{ item.name }}</p>
              <span class="num">{{ numberFormat(item.num) }}</span>
            </div>
          </div>
        </div>
        <div class="newest">
          <div class="find-title">
            <div>
              <h2 :class="{ small: newest }" @click="newest = false">新碟</h2>
              <h2 :class="{ small: !newest }" @click="newest = true">新歌</h2>
            </div>
            <a class="goto">{{ newest ? "新歌推荐" : "更多新碟" }}</a>
          </div>
          <div class="list" v-show="!newest">
            <div
              class="list-item"
              v-for="(item, index) in album"
              :key="index"
              @click="toAlbum(item)"
            >
              <img v-lazy="item.picUrl" alt="" />
              <p>{{ item.name }}</p>
              <span>{{ item.artist.name }}</span>
            </div>
          </div>
          <div class="list" v-show="newest">
            <div
              class="list-item new-song"
              v-for="(item, index) in song"
              :key="index"
              @click="toPlayer(item)"
            >
              <img v-lazy="item.album.picUrl" alt="" />
              <p>{{ item.name }}</p>
              <span>{{ item.artists[0].name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import Loading from "../components/Loading";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Find",
  components: {
    swiper,
    swiperSlide,
    Loading
  },
  data() {
    return {
      mini: false,
      banner: [],
      list: [],
      album: [],
      song: [],
      scroll: 0,
      offsetTop: 0,
      newest: false,
      loading: true,
      swiperOption: {
        loop: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      },
      icons: [
        {
          src: require("../assets/img/q1.png"),
          text: "每日推荐",
          url: "/recommend"
        },
        {
          src: require("../assets/img/q2.png"),
          text: "歌单",
          url: "/topList/推荐"
        },
        {
          src: require("../assets/img/q3.png"),
          text: "排行榜",
          url: "/top"
        },
        {
          src: require("../assets/img/q4.png"),
          text: "电台",
          url: "/djprogram"
        },
        {
          src: require("../assets/img/q5.png"),
          text: "直播",
          url: "/live"
        }
      ]
    };
  },
  created() {
    this.getBanner();
    this.getList();
  },
  activated() {
    this.$refs.find.scrollTop = this.offsetTop;
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
    ...mapActions([
      "getSongs",
      "getCurrentIndex",
      "getPlayList",
      "setPlaying",
      "setKeepAlive"
    ]),
    scrollHandler(e) {
      this.offsetTop = e.srcElement.scrollTop;
    },
    toPage(url) {
      if (url === "/topList/推荐") {
        this.$store.dispatch("setKeepAlive", []);
        this.$router.push(url);
      }
    },
    toDetail(item) {
      this.setKeepAlive([]);
      this.$router.push({
        name: "playlist",
        params: {
          id: item.id,
          name: item.name,
          copy: item.copy,
          mode: "playlist",
          num: this.numberFormat(item.num),
          picUrl: item.picUrl
        }
      });
    },
    toAlbum(item) {
      this.setKeepAlive([]);
      this.$router.push({
        name: "playlist",
        params: {
          id: item.id,
          name: item.name,
          copy: "",
          mode: "album",
          num: 0,
          picUrl: item.picUrl
        }
      });
    },
    toPlayer(item) {
      if (item.id !== this.currentSong.id) {
        this.$fetch("/song/detail", { ids: item.id })
          .then(data => {
            let arr = [];
            arr.push(data.songs[0]);
            this.getSongs(arr);
            this.getPlayList(arr);
            this.getCurrentIndex(0);
            this.setPlaying(true);
            this.$router.push({ name: "player" });
          })
          .catch(err => console.log(err));
      } else this.$router.push({ name: "player" });
    },
    getBanner() {
      this.$fetch("/banner")
        .then(data => {
          data.banners.map(item => {
            this.banner.push(item.imageUrl);
          });
        })
        .catch(err => console.log(err));
    },
    getList() {
      this.$fetch("/personalized", { limit: 6 })
        .then(data => {
          let obj = {},
            arr = [];
          data.result.map(item => {
            obj = {
              id: item.id,
              name: item.name,
              copy: item.copywriter,
              picUrl: item.picUrl,
              num: item.playCount
            };
            arr.push(obj);
          });
          this.list = arr;
        })
        .then(() => {
          this.$fetch("/top/album", { limit: 3 }).then(data => {
            this.album = data.albums;
          });
        })
        .then(() => {
          this.$fetch("/top/song", { type: 0 }).then(data => {
            let list = data.data;
            this.song = list.splice(0, 3);
            this.loading = false;
          });
        })
        .catch(err => console.log(err));
    },
    numberFormat(num) {
      let val;
      const k = 10000;
      if (num >= k && num < Math.pow(k, 2)) {
        val = parseInt(num / k) + "万";
      } else if (num >= Math.pow(k, 2)) {
        val = (num / Math.pow(k, 2)).toFixed(1) + "亿";
      } else {
        val = num;
      }
      return val;
    }
  }
};
</script>

<style scoped lang="less">
.find {
  height: 100%;
  overflow-y: auto;
}
.banner {
  border-radius: 8px;
  margin-left: 0.433rem;
  overflow: hidden;
}
.banner,
.banner-img {
  width: 9.133rem;
  height: 3.467rem;
}
.list-item {
  position: relative;
  width: 2.867rem;
  margin-bottom: 0.533rem;
  img {
    height: 2.867rem;
    width: 2.867rem;
    border-radius: 0.133rem;
    display: block;
  }
  p {
    color: #333;
    font-size: 0.36rem;
    margin-top: 0.06rem;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .num {
    position: absolute;
    top: 0.08rem;
    right: 0.16rem;
    padding-left: 0.44rem;
    color: #fff;
    font-size: 0.32rem;
    background: url("../assets/img/note1.png") left -0.01rem no-repeat;
    background-size: 0.5rem 0.5rem;
  }
}
.newest {
  .list-item {
    p {
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }
    span {
      color: #999;
      font-size: 0.32rem;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .new-song:before {
    content: "";
    position: absolute;
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    top: 1.933rem;
    right: 0.24rem;
    background: url("../assets/img/play1.png") no-repeat;
    background-size: 0.8rem;
  }
}
.icons {
  margin: 0.56rem 0.433rem 0 0.433rem;
  padding-bottom: 0.467rem;
  display: flex;
  justify-content: space-between;
  a {
    display: block;
    img {
      height: 1.28rem;
      width: 1.28rem;
      display: block;
    }
  }
  .icon-text {
    color: #333;
    text-align: center;
    margin-top: 0.16rem;
  }
}
.vux-1px-b:after {
  height: 0.013rem;
}
.recommend,
.newest {
  padding: 0 0.467rem;
}
.find-title {
  display: flex;
  justify-content: space-between;
  color: #333;
  margin-top: 0.56rem;
  margin-bottom: 0.427rem;
  h2 {
    font-size: 0.48rem;
    font-weight: bold;
  }
  .small {
    font-size: 0.4rem;
    color: #999;
  }
  .goto {
    display: block;
    height: 0.667rem;
    width: 1.867rem;
    line-height: 0.667rem;
    font-size: 0.36rem;
    text-align: center;
    border-radius: 25px;
    border: 1px solid #ccc;
  }
}
.newest {
  .find-title {
    h2 {
      display: inline-block;
      width: 1.2rem;
    }
  }
}
.list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>

<style lang="less">
.banner .swiper-pagination-bullet-active {
  background: #ce3d3a;
}
</style>
