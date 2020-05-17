<template>
  <ul ref="list" class="list-detail">
    <li v-for="(item, index) in songs" :key="index">
      <div class="detail-item" @click="jump(item)">
        <span
          class="song-num"
          :class="{
            'song-play': item.id === $store.getters.currentSong.id
          }"
          v-if="num"
          >{{ index + 1 }}</span
        >
        <div class="song-name" :class="{ 'name-left': !num }">
          <p class="name">
            {{ item.name
            }}<span class="name-alia" v-if="item.alia.length"
              >({{ item.alia[0] }})</span
            >
          </p>
          <span class="other" :class="{ vip: item.fee === 1 }"
            >{{ artists(item.ar) }}-{{ item.al.name }}</span
          >
          <span class="other" v-if="alia && item.alia.length">{{
            item.alia[0]
          }}</span>
        </div>
      </div>
      <a class="more"></a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "SongList",
  data() {
    return {};
  },
  props: {
    songs: Array,
    num: {
      type: Boolean,
      default: false
    },
    alia: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    jump(item) {
      this.$emit("jump", item);
    },
    artists(art) {
      let str = "";
      str = art.map(item => item.name).join("/");
      return str;
    }
  }
};
</script>

<style scoped lang="less">
.list-detail {
  background: #fff;
  z-index: 1;
}
.list-detail li {
  position: relative;
}
.detail-item {
  padding: 0.2rem 0;
  width: 100%;
  display: flex;
  align-items: center;
}
.song-num {
  font-size: 0.4rem;
  color: #ccc;
  width: 1.4rem;
  text-align: center;
}
.song-name {
  .name,
  .other {
    width: 7.2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .name {
    font-size: 0.427rem;
    color: #333;
  }
  .other {
    display: block;
    font-size: 0.32rem;
    color: #999;
  }
  .name-alia {
    font-size: 0.427rem;
    color: #999;
  }
}
.name-left {
  padding-left: 0.467rem;
  .name,
  .other {
    width: 8rem;
  }
}
.song-play {
  font-size: 0;
}
.song-play:before {
  content: "";
  display: block;
  margin-left: 0.32rem;
  height: 0.733rem;
  width: 0.733rem;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../assets/img/ah1.png");
  background-size: 0.65rem 0.65rem;
}
.more {
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  height: 100%;
  width: 1.333rem;
  background: url(../assets/img/anu.png) center no-repeat;
  background-size: 0.48rem 0.48rem;
}
.detail-item:active,
.more:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.vip:before {
  content: "";
  display: inline-block;
  background: url("../assets/img/alc.png") center no-repeat;
  background-size: 0.5rem 0.3rem;
  height: 0.3rem;
  width: 0.6rem;
  vertical-align: middle;
  margin-top: -0.06rem;
}
</style>
