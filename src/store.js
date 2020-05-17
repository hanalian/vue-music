import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerShow: false,
    songs: [],
    playList: [],
    currentIndex: 0,
    duration: 0,
    playing: false,
    songReady: false,
    keepAlive: [],
    mode: 0,
    liked: [],
    likeList: [],
    history: []
  },
  getters: {
    currentSong: state => {
      return (
        state.playList[state.currentIndex] || {
          name: "404",
          id: -1,
          ar: [
            {
              name: "Halie Loren"
            }
          ],
          al: {
            name: "404",
            picUrl:
              "http://p1.music.126.net/mnaAbyiLq548TNCCweiokA==/109951164515073911.jpg"
          }
        }
      );
    }
  },
  mutations: {
    changeDrawer(state) {
      state.drawerShow = !state.drawerShow;
    },
    getMode(state, mode) {
      state.mode = mode;
    },
    getSongs(state, list) {
      state.songs = list;
    },
    getPlayList(state, list) {
      state.playList = list;
    },
    getCurrentIndex(state, index) {
      state.currentIndex = index;
    },
    setPlaying(state, bool) {
      state.playing = bool;
    },
    setSongReady(state, bool) {
      state.songReady = bool;
    },
    play(state) {
      state.playing = true;
    },
    pause(state) {
      state.playing = false;
    },
    getTime(state, time) {
      state.duration = time;
    },
    setKeepAlive(state, keepAlive) {
      state.keepAlive = keepAlive;
    },
    setLiked(state, liked) {
      state.liked = liked;
    },
    setLikeList(state, list) {
      state.likeList = list;
    },
    setHistory(state, list) {
      state.history = list;
    }
  },
  actions: {
    handleChange({ commit }, index) {
      commit("change", index);
    },
    changeDrawer({ commit }) {
      commit("changeDrawer");
    },
    getMode({ commit }, mode) {
      commit("getMode", mode);
    },
    getSongs({ commit }, list) {
      commit("getSongs", list);
    },
    getPlayList({ commit }, list) {
      commit("getPlayList", list);
    },
    getCurrentIndex({ commit }, index) {
      commit("getCurrentIndex", index);
    },
    setPlaying({ commit }, bool) {
      commit("setPlaying", bool);
    },
    setSongReady({ commit }, bool) {
      commit("setSongReady", bool);
    },
    play({ commit }) {
      commit("play");
    },
    pause({ commit }) {
      commit("pause");
    },
    getTime({ commit }, time) {
      commit("getTime", time);
    },
    setKeepAlive({ commit }, keepAlive) {
      commit("setKeepAlive", keepAlive);
    },
    setLiked({ commit }, liked) {
      commit("setLiked", liked);
    },
    setLikeList({ commit }, list) {
      commit("setLikeList", list);
    },
    setHistory({ commit }, list) {
      commit("setHistory", list);
    }
  }
});
