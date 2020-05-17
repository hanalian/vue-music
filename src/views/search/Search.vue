<template>
  <div class="search-page">
    <TopNav isBlack class="search-nav">
      <div class="input-con">
        <form @submit.prevent="searchSubmit">
          <input
            ref="input"
            class="search-input"
            v-model.trim="word"
            :placeholder="placeholder || '歌单、视频、歌词、电台'"
          />
        </form>
        <a class="search-del" v-show="del" @click="delWord"></a>
      </div>
    </TopNav>
    <div class="search-suggest" v-show="suggest">
      <p class="search-word" @click.stop="toResult(word)">搜索"{{ word }}"</p>
      <p
        class="search-suggest-item"
        v-for="(item, index) in match"
        :key="index"
        @click.stop="toResult(item.keyword)"
      >
        {{ item.keyword }}
      </p>
    </div>
    <keep-alive>
      <router-view @word="changeWord"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import TopNav from "../../components/TopNav";

export default {
  name: "Search",
  components: { TopNav },
  data() {
    return {
      word: "",
      realKey: "",
      del: false,
      placeholder: "",
      match: [],
      suggest: false
    };
  },
  created() {
    this.$fetch("/search/default")
      .then(data => {
        this.placeholder = data.data.showKeyword;
        this.realKey = data.data.realkeyword;
      })
      .catch(err => console.log(err));
    if (!localStorage.getItem("word")) {
      localStorage.setItem("word", JSON.stringify([]));
    }
  },
  mounted() {
    document.addEventListener("click", e => {
      if (e.target.className !== "search-suggest") {
        this.suggest = false;
      }
    });
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/") {
      this.$store.dispatch("setKeepAlive", ["Search"]);
    } else {
      this.$store.dispatch("setKeepAlive", []);
    }
    next();
  },
  watch: {
    word(val, oVal) {
      if (val === oVal) return;
      if (val) {
        this.del = true;
        this.$fetch("/search/suggest", { keywords: val, type: "mobile" })
          .then(data => {
            if (!Object.keys(data.result).length) return;
            this.match = data.result.allMatch;
          })
          .catch(err => console(err));
        this.suggest = true;
      } else {
        this.del = false;
        this.suggest = false;
      }
    }
  },
  computed: {},
  methods: {
    delWord() {
      this.word = "";
      this.del = false;
    },
    searchSubmit() {
      if (!this.word && !this.placeholder) return;
      let searchWord = this.word ? this.word : this.realKey;
      let name = this.$route.name;
      name = this.$route.path === "/search" ? "/result" : `/${name}`;
      this.$router.replace({
        path: "/search/detail/" + searchWord + name
      });
      this.changeWord(searchWord);
    },
    toResult(key) {
      let name = this.$route.name;
      name = this.$route.path === "/search" ? "/result" : `/${name}`;
      this.$router.replace({
        path: "/search/detail/" + key + name
      });
      this.changeWord(key);
    },
    changeWord(key) {
      this.word = key;
      this.$nextTick(() => {
        this.suggest = false;
      });
      let words = JSON.parse(localStorage.getItem("word"));
      if (words.includes(key)) {
        let i = words.findIndex(i => i === key);
        words.unshift(words.splice(i, 1)[0]);
      } else words.unshift(key);
      if (words.length === 6) {
        words.pop();
      }
      localStorage.setItem("word", JSON.stringify(words));
    }
  }
};
</script>

<style scoped lang="less">
.search-page {
  position: relative;
  height: 100%;
}
.search-nav {
  background-color: #fff;
}
.input-con {
  position: relative;
  margin-right: 10px;
  width: calc(100vw - 1.8rem);
  height: 1.2rem;
  border-bottom: 0.013rem solid #000;
}
.search-input {
  font-size: 0.467rem;
  font-weight: normal;
  height: 1rem;
  margin-top: 0.133rem;
  width: 85%;
}
.search-nav .search-del {
  display: block;
  position: absolute;
  top: 0.15rem;
  right: 0;
  height: 1.067rem;
  width: 1.067rem;
  background: url("../../assets/img/asp.png") center no-repeat;
  background-size: 0.6rem;
}
.search-suggest {
  box-shadow: 0 0 12px #ccc;
  background-color: #fff;
  overflow-y: auto;
  position: absolute;
  top: 1.65rem;
  width: calc(100vw - 0.4rem - 10px);
  margin-left: 0.4rem;
  z-index: 20;
  max-height: calc(100vh - 1.65rem);
  .search-word,
  .search-suggest-item {
    position: relative;
    height: 1.067rem;
    line-height: 1.067rem;
    font-size: 0.373rem;
    text-indent: 1rem;
    color: #888;
    border-top: 1px solid rgba(0, 0, 0, 0.03);
  }
  .search-word {
    color: #477aac;
    text-indent: 0.4rem;
    border-top: 0;
  }
  .search-suggest-item:before {
    content: "";
    position: absolute;
    display: block;
    left: 0;
    height: 1.067rem;
    width: 1rem;
    background: url("../../assets/img/search.png") center no-repeat;
    background-size: 0.5rem;
  }
}

.search-input::-webkit-input-placeholder {
  color: #ccc;
}
.search-input:-moz-placeholder {
  color: #ccc;
}
.search-input::-moz-placeholder {
  color: #ccc;
}
.search-input:-ms-input-placeholder {
  color: #ccc;
}
</style>
