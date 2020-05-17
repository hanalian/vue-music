<template>
  <div
    class="result-item"
    :class="{
      'video-item': mode === 'video',
      'artist-item': mode === 'artist' || mode === 'user'
    }"
    @click="$emit('jump')"
  >
    <div class="video-img" v-if="imgDiv && mode === 'video'">
      <img v-lazy="imgUrl" alt="" />
      <span class="num">{{ numberFormat(playCount) }}</span>
    </div>
    <div
      class="album-img"
      :class="{ 'album-img-small': small }"
      v-if="imgDiv && mode === 'album'"
    >
      <img
        :class="{ 'img-small': small }"
        v-lazy="imgUrl"
        alt=""
      />
    </div>
    <img
      :class="{ 'img-small': small }"
      v-if="!imgDiv"
      v-lazy="imgUrl"
      alt=""
    />
    <div class="item-text">
      <p :class="{ 'one-line': oneLine || mode === 'artist' }">
        {{ name
        }}<span class="name-alia" v-if="alias !== ''">({{ alias }})</span>
      </p>
      <span v-if="mode === 'playlist'"
        >{{ trackCount }}首&nbsp;&nbsp;by {{ userName }}，播放{{
          numberFormat(playCount)
        }}次</span
      >
      <span v-if="mode === 'video'"
        >{{ format(durationms) }}&nbsp; by {{ userName }}</span
      >
      <span v-if="mode === 'album'"
        >{{ name }}&nbsp;&nbsp;{{ formatDate(publishTime) }}</span
      >
      <span v-if="mode === 'dj'">{{ userName }}</span>
      <span v-if="signature">{{ signature }}</span>
    </div>
    <a class="settled" v-if="accountId">已入驻</a>
    <a class="follow" v-if="mode === 'user'">关注</a>
  </div>
</template>

<script>
export default {
  name: "ResultItem",
  props: {
    mode: String,
    imgUrl: String,
    name: String,
    userName: String,
    signature: String,
    trackCount: Number,
    playCount: Number,
    durationms: Number,
    publishTime: Number,
    alias: {
      type: String,
      default: ""
    },
    accountId: {
      type: Boolean,
      default: false
    },
    imgDiv: {
      type: Boolean,
      default: false
    },
    oneLine: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    numberFormat(num) {
      let val;
      const k = 10000;
      if (num >= k && num < Math.pow(k, 2)) {
        val = (num / k).toFixed(1) + "万";
      } else if (num >= Math.pow(k, 2)) {
        val = (num / Math.pow(k, 2)).toFixed(1) + "亿";
      } else {
        val = num;
      }
      return val;
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
    formatDate(timestamp) {
      let date = new Date(timestamp);
      return date.toLocaleDateString().replace(/\//g, ".");
    }
  }
};
</script>

<style scoped lang="less">
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.133rem 0 0.133rem 0.467rem;
  img {
    width: 2.267rem;
    height: 2.267rem;
    border-radius: 0.133rem;
    display: block;
  }
  .img-small {
    width: 1.4rem;
    height: 1.4rem;
  }
}
.video-item img {
  width: 3.467rem;
  height: 1.933rem;
}
.artist-item img,
.user-item img {
  border-radius: 50%;
}
.album-img {
  width: 2.8rem;
  height: 2.267rem;
  background: url("../assets/img/ax0.png") right no-repeat;
  background-size: 0.533rem 2.267rem;
}
.album-img-small {
  width: 1.76rem;
  height: 1.4rem;
  background-size: 0.36rem 1.4rem;
}
.video-img {
  position: relative;
}
.video-img .num {
  position: absolute;
  top: 0.08rem;
  right: 0.16rem;
  padding-left: 0.44rem;
  color: #fff;
  font-size: 0.32rem;
  background: url("../assets/img/note1.png") left -0.01rem no-repeat;
  background-size: 0.5rem 0.5rem;
}
.item-text {
  flex: 1;
  margin-left: 0.267rem;
  margin-right: 0.533rem;
  p,
  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  p {
    line-height: 1.4;
    font-size: 0.427rem;
    -webkit-line-clamp: 2;
  }
  .one-line {
    -webkit-line-clamp: 1;
  }
  span {
    color: #999;
    -webkit-line-clamp: 1;
  }
  .name-alia {
    display: inline;
  }
}
.settled {
  margin-right: 0.467rem;
  padding-left: 0.6rem;
  background: url("../assets/img/anm.png") left no-repeat;
  background-size: 0.4rem;
  color: #999;
}
.follow {
  margin-right: 0.44rem;
  display: block;
  box-sizing: border-box;
  width: 1.8rem;
  height: 0.667rem;
  line-height: 0.667rem;
  padding-left: 0.72rem;
  border: 1px solid #ce3d3a;
  color: #ce3d3a;
  border-radius: 0.4rem;
  font-size: 0.347rem;
  background: url("../assets/img/b5b.png") 0.3rem center no-repeat;
  background-size: 0.32rem;
}
.result-item:active {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
