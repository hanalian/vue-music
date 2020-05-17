<template>
  <div class="my">
    <div class="my-icons-con">
      <div class="my-icons" @touchmove.stop ref="icon" @scroll="handleScroll">
        <div class="icons-item" v-for="(item, i) in icons" :key="i">
          <a
            class="icons-img"
            :style="{ backgroundPosition: -1.12 * i + 'rem 0' }"
          ></a>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
    <div class="vux-1px-b"></div>
    <div class="my-list">
      <div
        class="list-item"
        v-for="(item, i) in list"
        :key="i"
        @click="toHistory(i)"
      >
        <a class="iconfont" :class="'icon-' + item.icon"></a>
        <div class="list-text">
          <p>
            {{ item.text
            }}<span class="num"
              >({{ i === 1 ? $store.state.history.length : 0 }})</span
            >
          </p>
          <div
            class="vux-1px-b"
            :style="{ display: i === 4 ? 'none' : 'block' }"
          ></div>
        </div>
      </div>
    </div>
    <div class="blank"></div>
    <div class="created-list">
      <div class="title" @click="toggleChange">
        <p>
          <span class="iconfont icon-down" :class="{ rotate: toggle }"></span
          >创建的歌单<span class="num">(1)</span>
        </p>
        <div class="title-right" @click.stop>
          <a class="iconfont icon-hao"></a>
          <a class="iconfont icon-caidan"></a>
        </div>
      </div>
      <transition name="fade">
        <div class="detail-list" v-show="!toggle">
          <div class="list-item" @click="toDetail">
            <img src="../assets/img/heart.png" alt="" />
            <div class="item-text">
              <p>我喜欢的音乐</p>
              <span class="num">{{ $store.state.liked.length }}首</span>
            </div>
            <a class="heart"
              ><span class="iconfont icon-ziyuan"></span>心动模式</a
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "My",
  components: {},
  data() {
    return {
      icons: [
        "私人FM",
        "最嗨电音",
        "猜歌挑战",
        "Sati空间",
        "私藏推荐",
        "亲子频道",
        "古典专区",
        "跑步FM",
        "小冰电台",
        "爵士电台",
        "驾驶模式",
        "云村正能量",
        "节奏战争"
      ],
      list: [
        { text: "本地音乐", icon: "music" },
        { text: "最近播放", icon: "bofang" },
        { text: "下载管理", icon: "xiazai" },
        { text: "我的电台", icon: "diantai" },
        { text: "我的收藏", icon: "shoucang" }
      ],
      mini: false,
      toggle: false,
      offsetLeft: 0
    };
  },
  activated() {
    this.$refs.icon.scrollLeft = this.offsetLeft;
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "history") {
      this.setKeepAlive([]);
    }
    next();
  },
  methods: {
    toggleChange() {
      this.toggle = !this.toggle;
    },
    handleScroll(e) {
      this.offsetLeft = e.srcElement.scrollLeft;
    },
    toDetail() {
      this.$store.dispatch("setKeepAlive", []);
      this.$router.push({
        name: "playlist",
        params: {
          id: -1,
          name: "",
          copy: "",
          mode: "liked",
          num: 0,
          picUrl: require("../assets/img/heart.png")
        }
      });
    },
    toHistory(i) {
      if (i !== 1) return;
      this.$store.dispatch("setKeepAlive", []);
      this.$router.push({
        name: "history"
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "//at.alicdn.com/t/font_240521_vmwic038528.css";
.my {
  height: 100%;
}
.my-icons-con {
  width: 100%;
  box-sizing: border-box;
  padding-right: 1px;
}
.my-icons {
  height: 2.8rem;
  display: flex;
  align-items: center;
  overflow-x: auto;
  color: #999;
  font-size: 0.347rem;
}
.my-icons::-webkit-scrollbar {
  display: none;
}
.icons-item {
  flex: 0 0 18%;
  padding: 0.2rem;
  text-align: center;
}
.icons-img {
  display: block;
  width: 1.12rem;
  height: 1.12rem;
  margin: 0 auto 0.133rem auto;
  background-image: url("../assets/img/my.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 14.56rem 1.12rem;
}
.list-item {
  font-size: 0.4rem;
  color: #333;
  display: flex;
  align-items: center;
}
.num {
  color: #999;
  font-size: 0.347rem;
  margin-left: 0.08rem;
}
.my-list {
  .iconfont {
    font-size: 0.75rem;
    width: 2.133rem;
    text-align: center;
  }
  .list-item {
    height: 1.333rem;
    line-height: 1.333rem;
    width: 100%;
  }
  .list-text {
    flex: 1;
  }
}
.blank {
  background: #f5f5f5;
  height: 0.2rem;
}
.title {
  display: flex;
  align-items: center;
  height: 1.067rem;
  justify-content: space-between;
  padding: 0 0.32rem;
  p {
    font-size: 0.48rem;
    font-weight: 600;
  }
  .iconfont {
    font-size: 0.6rem;
  }
  .icon-down {
    font-size: 0.5rem;
    margin-right: 0.16rem;
  }
  .icon-caidan {
    margin-left: 0.267rem;
  }
}
.icon-down:before {
  display: inline-block;
  transition: all 0.5s;
}
.rotate:before {
  transform: rotate(-90deg);
}
.detail-list {
  padding: 0 0.4rem;
  .list-item {
    margin: 0.2rem 0;
  }
  img {
    width: 1.4rem;
    height: 1.4rem;
  }
  .item-text {
    flex: 1;
    margin: 0 0.267rem;
  }
  .heart {
    font-size: 0.34rem;
    display: block;
    box-sizing: border-box;
    height: 0.667rem;
    line-height: 0.66rem;
    width: 2.267rem;
    padding-left: 0.24rem;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    .iconfont {
      font-size: 0.36rem;
      font-weight: bold;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
