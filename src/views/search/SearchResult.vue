<template>
  <ResultPage
    class="search-result"
    page="result"
    :finished="finished"
    :loading="loading"
    :notfound="notfound"
    @result="scrollToBottom"
    @refresh="refresh"
  >
    <div v-if="order.includes('song')">
      <div class="block-title first-title">
        单曲<a class="play-all" @click.stop="playAll">播放全部</a>
      </div>
      <SongList alia :songs="singlelist" @jump="toPlayer"></SongList>
    </div>
    <div v-if="order.includes('playList')">
      <div class="block-title">歌单</div>
      <ResultItem
        v-for="(item, index) in playlist"
        :key="index"
        mode="playlist"
        :imgUrl="item.coverImgUrl"
        :name="item.name"
        :trackCount="item.trackCount"
        :userName="item.creator.nickname"
        :playCount="item.playCount"
        @jump="toDetail(item, 'playlist')"
      ></ResultItem>
    </div>
    <div v-if="order.includes('video')">
      <div class="block-title">视频</div>
      <ResultItem
        v-for="(item, index) in video"
        :key="index"
        mode="video"
        imgDiv
        :imgUrl="item.coverUrl"
        :name="item.title"
        :durationms="item.durationms"
        :userName="item.creator[0].userName"
        :playCount="item.playTime"
      ></ResultItem>
    </div>
    <div v-if="order.includes('sim_query')">
      <div class="block-title no-icon">相关搜索</div>
      <div class="sim-item">
        <a v-for="(item, index) in sim" :key="index">{{ item.keyword }}</a>
      </div>
    </div>
    <div v-if="order.includes('artist')">
      <div class="block-title">歌手</div>
      <ResultItem
        v-for="(item, index) in artist"
        :key="index"
        mode="artist"
        :imgUrl="item.picUrl ? item.picUrl : ''"
        :name="item.name"
        :alias="item.alias.length > 0 ? item.alias[0] : ''"
        :accountId="Boolean(item.accountId)"
      ></ResultItem>
    </div>
    <div v-if="order.includes('album')">
      <div class="block-title">专辑</div>
      <ResultItem
        v-for="(item, index) in album"
        :key="index"
        mode="album"
        imgDiv
        oneLine
        :imgUrl="item.picUrl"
        :name="item.name"
        :userName="item.artist.name"
        :alias="item.alias.length > 0 ? item.alias[0] : ''"
        :publishTime="item.publishTime"
        @jump="toDetail(item, 'album')"
      ></ResultItem>
    </div>
    <div v-if="order.includes('djRadio')">
      <div class="block-title">电台</div>
      <ResultItem
        v-for="(item, index) in dj"
        :key="index"
        mode="dj"
        :imgUrl="item.picUrl"
        :name="item.name"
        :userName="item.dj.nickname"
      ></ResultItem>
    </div>
    <div v-if="order.includes('user')">
      <div class="block-title">用户</div>
      <ResultItem
        v-for="(item, index) in user"
        :key="index"
        mode="user"
        :imgUrl="item.avatarUrl"
        :name="item.nickname"
        :signature="item.signature"
      ></ResultItem>
    </div>
    <Toast :text="text" v-model="toast" @hide="hide"></Toast>
  </ResultPage>
</template>

<script>
import SongList from "@/components/SongList";
import ResultItem from "@/components/ResultItem";
import ResultPage from "@/components/ResultPage";
import Toast from "@/components/Toast";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "SearchResult",
  components: { SongList, ResultItem, ResultPage, Toast },
  data() {
    return {
      offsetTop: 0,
      finished: false,
      order: [],
      songlist: [],
      singlelist: [],
      playlist: [],
      video: [],
      sim: [],
      artist: [],
      album: [],
      dj: [],
      user: [],
      notfound: false,
      loading: true,
      name: "",
      text: "",
      toast: false
    };
  },
  activated() {
    if (this.name !== this.$route.params.name) {
      this.refresh(this.$route.params.name);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.refresh(to.params.name);
    next();
  },
  computed: {
    ...mapState(["mode", "playList", "songs", "currentIndex"]),
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
    scrollToBottom() {
      this.finished = false;
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
    getData(key) {
      this.$fetch("/search", {
        keywords: key,
        type: 1018
      })
        .then(data => {
          let result = data.result;
          if (!Object.keys(result).length) {
            this.notfound = true;
            this.loading = false;
            return;
          }
          this.singlelist = result.song ? result.song.songs : [];
          this.playlist = result.playList ? result.playList.playLists : [];
          this.video = result.video ? result.video.videos : [];
          this.sim = result.sim_query ? result.sim_query.sim_querys : [];
          this.artist = result.artist ? result.artist.artists : [];
          this.album = result.album ? result.album.albums : [];
          this.dj = result.djRadio ? result.djRadio.djRadios : [];
          this.user = result.user ? result.user.users : [];
          this.order = result.order;
          this.loading = false;
        })
        .then(() => this.checkCopyright())
        .catch(err => {
          console.log(err);
          this.notfound = true;
          this.loading = false;
        });
    },
    checkCopyright() {
      let ids = [],
        arr = [];
      arr = this.singlelist.filter(item => {
        return item.fee !== 1;
      });
      arr.forEach(item => ids.push(item.id));
      this.$fetch("/song/detail", { ids: ids.join(",") })
        .then(data => {
          let list = data.privileges,
            j = 0;
          for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].st < 0) {
              arr.splice(i - j, 1);
              j++;
            }
          }
          this.songlist = arr;
        })
        .catch(err => console.log(err));
    },
    toDetail(item, type) {
      this.setKeepAlive([]);
      if (type === "playlist") {
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
      }
      if (type === "album") {
        let name =
          item.alias.length > 0 ? `${item.name}(${item.alias[0]})` : item.name;
        this.$router.push({
          name: "playlist",
          params: {
            id: item.id,
            name: name,
            copy: "",
            mode: "album",
            num: 0,
            picUrl: item.picUrl
          }
        });
      }
    },
    toPlayer(item) {
      if (item.fee === 1) {
        this.text = "未登录/购买VIP";
        this.toast = true;
        return;
      }
      let notplay = false;
      this.$fetch("/song/detail", { ids: item.id })
        .then(data => {
          notplay = data.privileges[0].st < 0;
        })
        .then(
          () => {
            if (notplay) {
              this.text = "此音乐暂时无版权";
              this.toast = true;
              return;
            }
            let list = [...this.songs],
              index = 0;
            if (list.length <= 1) {
              list.push(item);
              index = list.length - 1;
            } else {
              let li = this.findNewIndex(list, this.currentSong.id);
              let i = this.findNewIndex(list, item.id);
              if (i < 0) {
                list.splice(li + 1, 0, item);
                index = li + 1;
              } else {
                if (li < i) {
                  list.splice(li + 1, 0, list.splice(i, 1)[0]);
                  index = li + 1;
                } else if (li > i) {
                  list.splice(li, 0, list.splice(i, 1)[0]);
                  index = li;
                } else {
                  index = li;
                }
              }
            }
            this.getSongs([...list]);
            let playList = [...list];
            if (this.mode === 1 && list.length > 2) {
              playList = this.shuffle([...list]);
              index = this.findNewIndex(playList, item.id);
            }
            this.getPlayList(playList);
            this.getCurrentIndex(index);
            this.setPlaying(true);
            this.$router.push({ name: "player" });
          },
          error => console.log(error)
        );
    },
    playAll() {
      this.getSongs([...this.songlist]);
      let index = 0;
      let playList = [...this.songlist];
      if (this.mode === 1 && this.songlist.length > 2) {
        playList = this.shuffle([...this.songlist]);
        index = this.findNewIndex(playList, this.songlist[0].id);
      }
      this.getPlayList(playList);
      this.getCurrentIndex(index);
      this.setPlaying(true);
      this.$router.push({ name: "player" });
    },
    refresh(key) {
      this.singlelist = [];
      this.playlist = [];
      this.video = [];
      this.sim = [];
      this.artist = [];
      this.album = [];
      this.dj = [];
      this.user = [];
      this.order = [];
      this.loading = true;
      this.finished = false;
      this.getData(key);
      this.name = key;
    },
    hide() {
      this.toast = false;
    }
  }
};
</script>

<style scoped lang="less">
.search-result {
  padding-top: 0;
}
.block-title {
  font-size: 0.48rem;
  font-weight: bold;
  margin-top: 0.6rem;
  margin-bottom: 0.4rem;
  padding-left: 0.467rem;
  position: relative;
}
.first-title {
  margin-top: 0.4rem;
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: space-between;
}
.block-title:after {
  content: "";
  display: block;
  position: absolute;
  left: 1.6rem;
  top: 0.16rem;
  width: 0.267rem;
  height: 0.4rem;
  background: url("../../assets/img/b4y.png") center no-repeat;
  background-size: 100%;
}
.no-icon:after {
  content: none;
}
.play-all {
  display: block;
  font-size: 0.32rem;
  font-weight: normal;
  width: 2.333rem;
  height: 0.667rem;
  line-height: 0.667rem;
  border: 0.013rem solid #ccc;
  border-radius: 0.4rem;
  box-sizing: border-box;
  padding-left: 0.75rem;
  margin-right: 0.467rem;
  background: url("../../assets/img/any.png") 0.28rem center no-repeat;
  background-size: 0.36rem;
}
.sim-item {
  padding: 0 0.467rem;
  a {
    display: inline-block;
    padding: 0.133rem 0.266rem;
    margin-bottom: 0.24rem;
    margin-right: 0.3rem;
    border-radius: 15px;
    font-size: 0.427rem;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
