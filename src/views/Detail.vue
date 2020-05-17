<template>
  <div class="detail-page" ref="detail" @scroll="scrollHandler">
    <div
      class="header-bg"
      :style="{ backgroundImage: 'url(' + picUrl + ')' }"
      key="bg1"
    >
      <div class="filter"></div>
    </div>
    <div class="fixed" v-if="show">
      <div class="bg-fixed" :style="{ backgroundImage: 'url(' + picUrl + ')' }">
        <div class="filter"></div>
      </div>
    </div>
    <TopNav ref="top" :class="{ 'title-bg': isOpacity }">
      <div class="top-left">
        <div class="top-title">
          <p class="simple">
            {{ type === "playlist" || type === "liked" ? "歌单" : "专辑" }}
          </p>
          <span v-if="copy">{{ copy }}</span>
        </div>
      </div>
      <div class="top-right">
        <a><img src="../assets/img/wx.png" alt=""/></a>
        <a><img src="../assets/img/yi.png" alt=""/></a>
      </div>
    </TopNav>
    <div class="playlist">
      <div class="content">
        <div class="header" ref="header" :style="{ opacity: opacity }">
          <div class="header-con">
            <div class="list-item">
              <img :src="picUrl" alt="" />
              <span v-if="type === 'playlist'" class="num">{{
                playCount
              }}</span>
            </div>
            <div class="header-detail">
              <h2 class="list-name">
                {{ type === "liked" ? "我喜欢的音乐" : name }}
              </h2>
              <a class="creator">
                <img v-if="type === 'playlist'" :src="creatorUrl" alt="" />
                <img
                  v-if="type === 'liked'"
                  src="../assets/img/aje.png"
                  alt=""
                />
                <span>{{
                  type === "playlist"
                    ? creator
                    : type === "liked"
                    ? "未登录"
                    : "歌手：" + creator
                }}</span>
              </a>
              <div class="description">
                <a class="publish-time" v-if="type === 'album'"
                  >发行时间:{{ formatDate(publishTime) }}</a
                >
                <a class="details" :class="{ 'details-line': type === 'album' }"
                  >{{ description }}
                </a>
              </div>
            </div>
          </div>
          <div class="list-icon">
            <div class="icon-item">
              <img src="../assets/img/an0.png" alt="" />
              <p>{{ commentCount }}</p>
            </div>
            <div class="icon-item">
              <img src="../assets/img/an8.png" alt="" />
              <p>{{ shareCount }}</p>
            </div>
            <div class="icon-item">
              <img src="../assets/img/an1.png" alt="" />
              <p>下载</p>
            </div>
            <div class="icon-item">
              <img src="../assets/img/an5.png" alt="" />
              <p>多选</p>
            </div>
          </div>
        </div>
        <div
          class="song-list"
          :style="{
            minHeight:
              playList.length > 0
                ? 'calc(100vh - 9.3rem)'
                : 'calc(100vh - 7.967rem)'
          }"
        >
          <Loading class="playlist-loading" v-if="loaded"></Loading>
          <div class="content" v-else>
            <div
              class="list-title"
              :class="{ 'list-title-fixed': show }"
              ref="title"
            >
              <p>
                播放全部
                <span
                  >(共{{
                    type === "liked" ? songs.length : trackCount
                  }}首)</span
                >
              </p>
              <a v-if="type !== 'liked'" class="collect"
                >收藏({{ numberFormat(subscribedCount) }})</a
              >
            </div>
            <div class="detail-item" style="height: 1.4rem" v-if="show"></div>
            <SongList num :songs="songs" @jump="jump"></SongList>
          </div>
        </div>
      </div>
    </div>
    <div class="alert" v-transfer-dom>
      <alert v-model="vipAlert" title="提示"
        >未登录/未购买VIP歌曲不能播放</alert
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { Alert, TransferDom } from "vux";
import TopNav from "../components/TopNav";
import SongList from "../components/SongList";
import Loading from "../components/Loading";

export default {
  name: "Detail",
  components: { Alert, TopNav, SongList, Loading },
  directives: {
    TransferDom
  },
  data() {
    return {
      transitionName: "fade",
      fixed: false,
      opacity: 1,
      isOpacity: false,
      show: false,
      songs: [],
      loaded: true,
      scrollTop: 0,
      creator: "",
      creatorUrl: "",
      description: "",
      trackCount: 0,
      shareCount: 0,
      commentCount: 0,
      subscribedCount: "",
      publishTime: 0,
      picUrl: "",
      copy: "",
      type: "playlist",
      name: "",
      playCount: "",
      lIndex: -1,
      vipAlert: false,
      finished: false
    };
  },
  activated() {
    this.$refs.detail.scrollTop = this.scrollTop;
  },
  created() {
    this.copy = this.$route.params.copy;
    this.type = this.$route.params.mode;
    this.picUrl = this.$route.params.picUrl;
    this.name = this.$route.params.name;
    this.playCount = this.$route.params.num;
    if (this.type === "liked") {
      this.shareCount = "分享";
      this.commentCount = "评论";
      this.songs = JSON.parse(localStorage.getItem("likeList"));
      this.loaded = false;
    } else this.getDetail();
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/player") {
      this.$store.dispatch("setKeepAlive", []);
    } else {
      this.$store.dispatch("setKeepAlive", ["Detail"]);
    }
    next();
  },
  computed: {
    ...mapState(["mode", "playList", "currentIndex"]),
    ...mapGetters(["currentSong"])
  },
  methods: {
    ...mapActions(["getSongs", "getCurrentIndex", "getPlayList", "setPlaying"]),
    back() {
      this.$router.go(-1);
    },
    scrollHandler(el) {
      this.show = el.srcElement.scrollTop >= this.$refs.header.offsetHeight;
      this.opacity =
        1 - el.srcElement.scrollTop / this.$refs.header.offsetHeight;
      this.isOpacity = el.srcElement.scrollTop >= 20;
    },
    getDetail() {
      let id = this.$route.params.id;
      if (this.type === "playlist") {
        this.$fetch("/playlist/detail", { id: id })
          .then(data => {
            this.creator = data.playlist.creator.nickname;
            this.creatorUrl = data.playlist.creator.avatarUrl;
            this.description = data.playlist.description;
            this.trackCount = data.playlist.trackCount;
            this.shareCount = data.playlist.shareCount;
            this.commentCount = data.playlist.commentCount;
            this.subscribedCount = data.playlist.subscribedCount;
            this.songs = data.playlist.tracks;
          })
          .then(() => (this.loaded = false))
          .catch(err => console.log(err));
      } else {
        this.$fetch("/album", { id: id })
          .then(data => {
            this.creator = data.album.artist.name;
            this.description = data.album.description;
            this.trackCount = data.songs.length;
            this.songs = data.songs;
            this.publishTime = data.album.publishTime;
          })
          .then(() => {
            this.$fetch("/album/detail/dynamic", { id: id }).then(data => {
              this.shareCount = data.shareCount;
              this.commentCount = data.commentCount;
              this.subscribedCount = data.subCount;
            });
          })
          .then(() => (this.loaded = false))
          .catch(err => console.log(err));
      }
    },
    numberFormat(num) {
      let val;
      const k = 10000;
      if (num >= k) {
        val = (num / k).toFixed(1) + "万";
      } else {
        val = num;
      }
      return val;
    },
    formatDate(timestamp) {
      let date = new Date(timestamp);
      return date.toLocaleDateString().replace(/\//g, ".");
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
    jump(item) {
      if (item.id === this.currentSong.id) {
        this.scrollTop = this.$refs.detail.scrollTop;
        this.$router.push({ name: "player" });
      } else {
        if (item.fee === 1) {
          this.vipAlert = true;
          return;
        }
        let arr = this.songs.filter(item => {
          return item.fee !== 1;
        });
        this.getSongs(arr);
        let index = this.findNewIndex(arr, item.id);
        let playList = arr;
        if (this.mode === 1 && arr.length > 2) {
          playList = this.shuffle(arr);
          index = this.findNewIndex(playList, item.id);
        }
        this.getPlayList(playList);
        this.getCurrentIndex(index);
      }
      this.setPlaying(true);
    }
  }
};
</script>

<style scoped lang="less">
.detail-page {
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
.header-bg,
.bg-fixed {
  background-color: #aaa;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  filter: blur(30px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #999;
    opacity: 0.6;
  }
}
.bg-fixed {
  top: -6.5rem;
}
.list-title-fixed {
  position: fixed;
  top: 1.467rem;
}
.fixed {
  height: 1.467rem;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background-color: #fff;
}
.top-nav,
.top-left,
.top-right,
.creator {
  display: flex;
  align-items: center;
}

.top-right img {
  vertical-align: middle;
  height: 0.693rem;
  width: 0.693rem;
}
.opacity {
  background-color: rgba(255, 255, 255, 0.1);
}
.top-left,
.top-title {
  flex: 1;
}
.top-left a {
  margin: 0 0.133rem;
}
.top-title {
  color: #fff;
  max-width: 75%;
  p {
    font-size: 0.467rem;
    line-height: 0.48rem;
    margin-top: 0.08rem;
  }
  span {
    display: block;
    font-size: 0.24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.title-bg {
  background-color: rgba(255, 255, 255, 0.1);
}
.header {
  box-sizing: border-box;
  height: 6.5rem;
  padding: 0.533rem 0.427rem 0.467rem 0.427rem;
}
.header-con,
.list-icon {
  display: flex;
}
.list-item {
  position: relative;
  width: 3.533rem;
  margin-right: 0.533rem;
  img {
    height: 3.533rem;
    width: 3.533rem;
    background-color: #aaa;
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
.header-detail {
  position: relative;
  color: #fff;
}
.list-name {
  color: #fff;
  font-size: 0.467rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.creator {
  font-size: 0.373rem;
  /*color: #d8d8d8;*/
  margin-top: 0.2rem;
  margin-bottom: 0.35rem;
  img {
    height: 0.8rem;
    width: 0.8rem;
    border-radius: 50%;
    margin-right: 0.24rem;
    background-color: #aaa;
  }
  span {
    padding-right: 0.333rem;
    background: url("../assets/img/ze.png") right 0.15rem no-repeat;
    background-size: 0.16rem 0.267rem;
  }
}
.description {
  position: absolute;
  bottom: 0;
  a {
    display: block;
    font-size: 0.32rem;
  }
  .details {
    min-width: 4.2rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 0.32rem;
    padding-right: 0.267rem;
    background: url("../assets/img/ze.png") right center no-repeat;
    background-size: 0.16rem 0.267rem;
  }
  .details-line {
    -webkit-line-clamp: 1;
  }
}
.list-icon {
  justify-content: space-between;
  text-align: center;
  margin-top: 0.667rem;
}
.icon-item {
  width: 150px;
  img {
    height: 0.6rem;
    width: 0.6rem;
  }
  p {
    color: hsla(0, 0%, 100%, 0.7);
  }
}

.song-list {
  background: #fff;
  border-top-left-radius: 0.533rem;
  border-top-right-radius: 0.533rem;
  position: relative;
  min-height: calc(100vh - 7.867rem);
}
.list-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-title {
  height: 1.4rem;
  width: 100%;
  background: #fff;
  border-top-left-radius: 0.533rem;
  border-top-right-radius: 0.533rem;
  z-index: 5;
  p {
    background: url("../assets/img/any.png") left center no-repeat;
    background-size: 0.6rem 0.6rem;
    margin-left: 0.4rem;
    padding-left: 1rem;
    line-height: 1.4rem;
    font-size: 0.427rem;
    color: #333;
    span {
      font-size: 0.347rem;
      color: #b2b2b2;
    }
  }
}
.title-fixed {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  position: absolute;
  top: 1.467rem;
  left: 0;
  right: 0;
}
.collect {
  display: block;
  position: relative;
  height: 1.067rem;
  line-height: 1.067rem;
  margin-right: 0.133rem;
  padding-left: 0.8rem;
  padding-right: 0.4rem;
  font-size: 0.347rem;
  color: #fff;
  background: linear-gradient(left top, #ff6633, #ff3333);
  border-radius: 0.533rem;
}
.collect:before {
  content: "";
  display: block;
  height: 0.44rem;
  width: 0.44rem;
  position: absolute;
  left: 0.3rem;
  top: 0.32rem;
  background: url("../assets/img/b3i.png") center no-repeat;
  background-size: 0.44rem 0.44rem;
}
.collect-active,
.collect:active {
  background: #cb2f2f;
}
.list-detail {
  background: #fff;
  z-index: 1;
}
.list-detail li {
  position: relative;
}
.detail-item {
  height: 1.6rem;
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
  width: 7.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  p {
    font-size: 0.427rem;
    color: #333;
  }
  span {
    font-size: 0.32rem;
    color: #999;
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
  height: 1.6rem;
  width: 1.333rem;
  background: url(../assets/img/anu.png) center no-repeat;
  background-size: 0.48rem 0.48rem;
}
.detail-item:active,
.more:active {
  background-color: rgba(0, 0, 0, 0.05);
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
.playlist .playlist-loading {
  padding-top: 0.8rem;
}
.fade-detail-enter-active {
  transition: transform 50ms;
  transform-origin: top;
  transform: scaleY(1);
}
.fade-detail-leave-active {
  transition: transform 50ms;
  transform-origin: top;
  transform: scaleY(0);
}
.fade-detail-enter {
  transform: scaleY(0);
}
.fade-detail-leave {
  transform: scaleY(1);
}
</style>
