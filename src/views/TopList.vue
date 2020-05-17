<template>
  <div class="top-list">
    <TopNav isBlack>
      <p class="nav-title">歌单广场</p>
    </TopNav>
    <div class="tab-con">
      <tab
        v-model="tabIndex"
        :scroll-threshold="4"
        :animate="animate"
        custom-bar-width="0.853rem"
        active-color="#ff3a3a"
        default-color="#333"
        class="stop-swiping"
        ref="tab"
      >
        <tab-item
          v-for="(item, index) in tab"
          :key="index"
          :selected="index === tabIndex"
          ref="tabitem"
          @on-item-click="handler(item)"
          >{{ item }}</tab-item
        >
      </tab>
      <div class="top-sort" @click="toLabel">
        <a class="sort"></a>
      </div>
    </div>
    <keep-alive>
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import TopNav from "../components/TopNav";
import { Tab, TabItem } from "vux";

export default {
  name: "TopList",
  components: { TopNav, Tab, TabItem },
  data() {
    return {
      tab: [],
      tabIndex: 0,
      animate: true,
      scrollLeft: 0
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/") {
      this.$store.dispatch("setKeepAlive", ["TopList"]);
    } else {
      this.$store.dispatch("setKeepAlive", []);
    }
    next();
  },
  created() {
    if (!localStorage.getItem("label")) {
      let labels = ["推荐", "精品", "华语", "轻音乐", "摇滚", "民谣", "电子"];
      localStorage.setItem("label", JSON.stringify(labels));
    }
    this.tab = JSON.parse(localStorage.getItem("label"));
  },
  activated() {
    this.$refs.tab.$refs.nav.scrollLeft = this.scrollLeft;
  },
  destroyed() {
    localStorage.removeItem("oldLabel");
    localStorage.removeItem("path");
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("setKeepAlive", []);
      if (from.path === "/label") {
        let n = parseInt(localStorage.getItem("path"));
        if (
          JSON.parse(localStorage.getItem("label")).toString() !==
          JSON.parse(localStorage.getItem("oldLabel")).toString()
        ) {
          let current = vm.$refs.tab.$refs.nav.children[n];
          let nav = vm.$refs.tab.$refs.nav;
          vm.$refs.tab.$refs.nav.scrollLeft =
            current.offsetLeft -
            (nav.offsetWidth - current.offsetWidth) / 2 -
            nav.scrollLeft;
        }
        vm.tabChange();
        vm.$router.replace({
          path: "/topList/" + vm.tab[n]
        });
      }
    });
  },
  methods: {
    handler(name) {
      this.$router.replace({
        path: "/topList/" + name
      });
    },
    toLabel() {
      this.scrollLeft = this.$refs.tab.$refs.nav.scrollLeft;
      this.$router.push({
        path: "/label"
      });
      localStorage.setItem("oldLabel", JSON.stringify(this.tab));
      localStorage.setItem("path", this.tabIndex);
    },
    tabChange() {
      if (this.tabIndex === parseInt(localStorage.getItem("path"))) return;
      this.animate = false;
      this.tabIndex = parseInt(localStorage.getItem("path"));
      setTimeout(() => {
        this.animate = true;
      }, 50);
    }
  }
};
</script>

<style scoped lang="less">
.nav-title {
  font-size: 0.467rem;
  flex: 1;
}
.tab-con {
  position: relative;
  display: flex;
  .top-sort {
    height: 1rem;
    width: 1.2rem;
    background: linear-gradient(
        180deg,
        #e5e5e5,
        #e5e5e5,
        rgba(229, 229, 229, 0)
      )
      bottom left no-repeat;
    background-size: 100% 1px;
  }
  .sort {
    display: block;
    height: 1rem;
    width: 1.2rem;
    background: url("../assets/img/sort.png") center 0.24rem no-repeat;
    background-size: 0.48rem;
  }
}
</style>
<style>
.tab-con .vux-tab-wrap {
  padding-top: 1rem;
  flex: 1;
}
.tab-con .vux-tab,
.tab-con .vux-tab-container {
  height: 1rem;
}
.tab-con .vux-tab {
  background-color: transparent;
}
.tab-con .scrollable .vux-tab-ink-bar {
  margin-left: 0.4%;
}
.tab-con .vux-tab .vux-tab-item {
  line-height: 0.9rem;
  font-size: 0.427rem;
}
</style>
