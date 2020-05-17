<template>
  <div class="search-detail">
    <div class="tab-con">
      <tab
        :scroll-threshold="4"
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
          @on-item-click="handler(item.name)"
          >{{ item.text }}</tab-item
        >
      </tab>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import "swiper/dist/css/swiper.css";

export default {
  name: "SearchDetail",
  components: {
    Tab,
    TabItem
  },
  data() {
    return {
      tab: [
        {
          text: "综合",
          name: "result"
        },
        {
          text: "单曲",
          name: "single"
        },
        {
          text: "视频",
          name: "video"
        },
        {
          text: "歌手",
          name: "singer"
        },
        {
          text: "专辑",
          name: "album"
        },
        {
          text: "歌单",
          name: "list"
        },
        {
          text: "主播电台",
          name: "dj"
        },
        {
          text: "用户",
          name: "user"
        }
      ],
      tabIndex: 0
    };
  },
  methods: {
    handler(name) {
      this.$router.replace({
        name: name
      });
    }
  }
};
</script>

<style scoped>
.search-detail {
  height: 100%;
}
.tab-con {
  position: sticky;
  top: 1.467rem;
  height: 1rem;
  width: 100%;
  z-index: 10;
}
</style>
<style>
.search-detail .vux-tab-wrap {
  padding-top: 1rem;
}
.search-detail .vux-tab .vux-tab-item {
  line-height: 1rem;
}
</style>
