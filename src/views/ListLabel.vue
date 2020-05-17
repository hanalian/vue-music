<template>
  <div class="list-label">
    <TopNav isBlack style="background-color: #fff">
      <p class="nav-title">歌单标签</p>
    </TopNav>
    <div class="my-label-con">
      <div class="label-title">
        <p>
          我的歌单广场<span>({{ edit ? "拖动可排序" : "长按可编辑" }})</span>
        </p>
        <a class="label-edit" @click="handleEdit">{{
          edit ? "完成" : "编辑"
        }}</a>
      </div>
      <div
        v-if="del"
        class="my-label"
        ref="myLabel"
        :style="{
          height: Math.ceil(labels.length / 4) * 0.667 + 'rem'
        }"
      >
        <div
          v-for="(item, index) in labels"
          :key="index"
          class="my-label-item"
          ref="label"
          :style="{
            top: parseInt(index / 4) * 1.267 + 'rem',
            left: (index % 4) * 2.333 + 'rem'
          }"
        >
          <a
            class="label-item"
            :class="{
              minus: edit,
              hot: item.hot,
              disable: edit && (index === 0 || index === 1)
            }"
            :style="{
              fontSize: item.name.length >= 4 ? 0.32 + 'rem' : 0.373 + 'rem',
              paddingLeft:
                item.name.length >= 4 && edit
                  ? 0.6 + 'rem'
                  : item.hot || edit
                  ? 0.42 + 'rem'
                  : 0
            }"
            >{{ item.name }}</a
          >
        </div>
      </div>
      <div
        v-if="!del"
        class="my-label my-label-copy"
        ref="myLabel2"
        :style="{ height: Math.ceil(labels.length / 4) * 0.667 + 'px' }"
      >
        <div
          v-for="(item, index) in labels"
          :key="index"
          class="my-label-item"
          ref="label"
          :style="{
            top: parseInt(index / 4) * 1.267 + 'rem',
            left: (index % 4) * 2.333 + 'rem'
          }"
          @click="remove(item, index)"
          @touchstart="touchstart"
          @touchend="touchend"
        >
          <a
            class="label-item"
            :class="{
              minus: edit,
              hot: item.hot,
              disable: edit && (index === 0 || index === 1)
            }"
            :style="{
              fontSize: item.name.length >= 4 ? 0.32 + 'rem' : 0.373 + 'rem',
              paddingLeft:
                item.name.length >= 4 && edit
                  ? 0.6 + 'rem'
                  : item.hot || edit
                  ? 0.42 + 'rem'
                  : 0
            }"
            >{{ item.name }}</a
          >
        </div>
      </div>
    </div>
    <div
      class="label-type"
      :class="{ 'no-transition': this.loading }"
      :style="{
        marginTop: Math.ceil(this.labels.length / 4) * 1.334 + 0.8 + 'rem'
      }"
    >
      <div
        v-for="(item, index) in labelList"
        :key="index"
        :ref="item.ref + 'Con'"
      >
        <div class="label-title">{{ item.category }}</div>
        <div class="label-con">
          <div
            class="label-item-con"
            v-for="(i, n) in item.list"
            :ref="item.ref"
            :key="n"
            @click="addLabel(i, index, n)"
          >
            <a
              class="label-item"
              :class="{
                add: edit,
                hot: i.hot,
                disable: labels.includes(i)
              }"
              :style="{
                fontSize: i.name.length >= 4 ? 0.32 + 'rem' : 0.373 + 'rem',
                paddingLeft:
                  i.name.length >= 4 && edit
                    ? 0.6 + 'rem'
                    : i.hot || edit
                    ? 0.42 + 'rem'
                    : 0
              }"
              >{{ i.name }}</a
            >
            <a
              class="label-item label-item-copy"
              v-if="edit && outerIndex === index && innerIndex === n"
              :class="{ minus: edit }"
              :style="{
                fontSize: i.name.length >= 4 ? 0.32 + 'rem' : 0.373 + 'rem',
                paddingLeft:
                  i.name.length >= 4 && edit
                    ? 0.6 + 'rem'
                    : i.hot || edit
                    ? 0.42 + 'rem'
                    : 0
              }"
              :ref="item.ref + n"
              >{{ i.name }}</a
            >
          </div>
        </div>
      </div>
    </div>
    <Toast v-model="toast" text="不能再少了" @hide="hide"></Toast>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import Toast from "@/components/Toast";

export default {
  name: "ListLabel",
  components: { TopNav, Toast },
  data() {
    return {
      catlist: [],
      labels: [],
      nLabels: [],
      labelList: [],
      num: 0,
      del: false,
      hasChange: false,
      edit: false,
      outerIndex: -1,
      innerIndex: -1,
      timer: 0,
      clickable: true,
      path: 0,
      loading: true,
      toast: false
    };
  },
  created() {
    this.getCatList();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "top") {
      let hasChange =
        this.nLabels.toString() ===
        JSON.parse(localStorage.getItem("label")).toString();
      if (!hasChange) {
        this.$store.dispatch("setKeepAlive", ["TopList", "ListLabel"]);
        localStorage.setItem("label", JSON.stringify(this.nLabels));
        localStorage.setItem("path", this.path);
      } else {
        this.$store.dispatch("setKeepAlive", ["ListLabel"]);
      }
    }
    next();
  },
  methods: {
    touchstart() {
      clearTimeout(this.timer);
      if (!this.edit) {
        this.timer = setTimeout(() => {
          this.edit = true;
        }, 500);
      }
    },
    touchend() {
      clearTimeout(this.timer);
    },
    getCatList() {
      this.$fetch("/playlist/catlist")
        .then(data => {
          this.catlist = data.sub;
        })
        .then(() => {
          this.handleLabel();
          this.timer = setTimeout(() => {
            this.loading = false;
          }, 500);
        })
        .catch(err => console.log(err));
    },
    handleLabel() {
      this.nLabels = JSON.parse(localStorage.getItem("label"));
      let arr = new Array(this.nLabels.length);
      let languages = [],
        styles = [],
        scenes = [],
        emotions = [],
        themes = [];
      this.catlist.map(item => {
        switch (item.category) {
          case 0:
            languages.push(item);
            break;
          case 1:
            styles.push(item);
            break;
          case 2:
            scenes.push(item);
            break;
          case 3:
            emotions.push(item);
            break;
          case 4:
            themes.push(item);
            break;
        }
        arr[0] = {
          name: "推荐",
          category: 1,
          hot: false
        };
        arr[1] = {
          name: "精品",
          category: 1,
          hot: false
        };
        let index = this.nLabels.indexOf(item.name);
        if (index > 0) {
          arr[index] = item;
        }
      });
      this.labels = arr;
      this.labelList = [
        { category: "语种", ref: "language", list: languages },
        { category: "风格", ref: "style", list: styles },
        { category: "场景", ref: "scene", list: scenes },
        { category: "情感", ref: "emotion", list: emotions },
        { category: "主题", ref: "theme", list: themes }
      ];
    },
    handleEdit() {
      this.edit = !this.edit;
      this.$nextTick(() => {
        if (!this.edit) {
          let arr = [];
          this.labels.forEach(item => {
            arr.push(item.name);
          });
          this.nLabels = arr;
        }
      });
    },
    remove(item, n) {
      if (!this.edit) {
        let hasChange =
          this.nLabels.toString() ===
          JSON.parse(localStorage.getItem("label")).toString();
        this.path = n;
        this.$router.go(-1);
        if (hasChange) {
          localStorage.setItem("path", n);
        }
        return;
      }
      if (!this.clickable) return;
      if (n === 0 || n === 1) return;
      clearTimeout(this.timer);
      this.clickable = false;
      if (this.labels.length === 5) {
        this.toast = true;
        this.clickable = true;
        return;
      }
      this.del = true;
      let len = this.labels.length;
      let cat = item.category;
      let index = this.labelList[cat].list.indexOf(item);
      this.$nextTick(() => {
        for (let i = n + 1; i < len; i++) {
          this.$refs.label[i].style.top = parseInt((i - 1) / 4) * 1.267 + "rem";
          this.$refs.label[i].style.left = ((i - 1) % 4) * 2.333 + "rem";
        }
        let y =
          this.$refs[this.labelList[cat].ref][index].getBoundingClientRect()
            .top - this.$refs.myLabel.getBoundingClientRect().top;
        // let x = ;
        this.$refs.label[n].style.top = y + "px";
        this.$refs.label[n].style.left = (index % 4) * 2.333 + "rem";
      });
      this.timer = setTimeout(() => {
        this.labels.splice(n, 1);
        for (let i = n; i < len - 1; i++) {
          this.$refs.label[i].style.top = parseInt(i / 4) * 1.267 + "rem";
          this.$refs.label[i].style.left = (i % 4) * 2.333 + "rem";
        }
        this.del = false;
        this.clickable = true;
      }, 300);
    },
    addLabel(i, index, n) {
      if (!this.edit) {
        this.$router.push({
          name: "catList",
          params: {
            cat: i.name
          }
        });
        return;
      }
      if (!this.clickable) return;
      if (this.labels.includes(i)) return;
      clearTimeout(this.timer);
      this.clickable = false;
      this.outerIndex = index;
      this.innerIndex = n;
      this.$nextTick(() => {
        let ref = this.labelList[index].ref + n;
        let x,
          y,
          len = this.labels.length;

        y =
          this.$refs[this.labelList[index].ref + n][0].getBoundingClientRect()
            .top - this.$refs.label[len - 1].getBoundingClientRect().top;
        x = ((len % 4) - (n % 4)) * 2.333;
        if (len % 4 === 0) {
          y -= this.$refs.label[4].offsetTop;
        }
        this.$refs[ref][0].style.top = -y + "px";
        this.$refs[ref][0].style.left = x + "rem";
        this.timer = setTimeout(() => {
          this.labels.push(i);
          this.outerIndex = -1;
          this.innerIndex = -1;
          this.clickable = true;
        }, 200);
      });
    },
    hide() {
      this.toast = false;
    }
  }
};
</script>

<style scoped lang="less">
.list-label {
  height: 100%;
  position: relative;
  overflow-y: auto;
  color: #333;
}
.nav-title {
  font-size: 0.467rem;
  flex: 1;
}
.label-title {
  padding-left: 0.467rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.4rem;
  margin-bottom: 0.267rem;
  span {
    color: #999;
    font-size: 0.32rem;
  }
  .label-edit {
    display: block;
    width: 1.4rem;
    height: 0.667rem;
    line-height: 0.667rem;
    margin-right: 0.4rem;
    text-align: center;
    font-size: 0.347rem;
    color: #f33;
    background-color: #fff;
    box-sizing: border-box;
    border: 1px solid #f33;
    border-radius: 0.4rem;
  }
  .label-edit:active {
    background-color: #f33;
    color: #fff;
  }
}
.label-item-con {
  height: 1rem;
  margin-bottom: 0.267rem;
  margin-right: 0.267rem;
  position: relative;
}
.label-item {
  display: inline-block;
  box-sizing: border-box;
  height: 1rem;
  line-height: 1rem;
  width: 2.067rem;
  text-align: center;
  font-size: 0.373rem;
  border-radius: 0.6rem;
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.label-item-copy {
  position: absolute;
  top: 0;
  left: 0;
  transition: all 300ms;
  z-index: 2;
}
.my-label {
  position: absolute;
  width: calc(100vw - 0.467rem);
  top: 2.734rem;
  left: 0.467rem;
  .my-label-item {
    height: 1rem;
    position: absolute;
    transition: all 300ms;
    z-index: 1;
  }
}
.label-type {
  transition: margin-top 500ms;
}
.no-transition {
  transition: none;
}
.label-con {
  padding-left: 0.467rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
}
.hot,
.add,
.minus {
  padding-left: 0.42rem;
  padding-right: 0.05rem;
  background-image: url("../assets/img/hot.png");
  background-position: 0.24rem center;
  background-size: 0.35rem;
}
.add {
  background-image: url("../assets/img/add1.png");
}
.minus {
  background-image: url("../assets/img/add.png");
}
.disable {
  opacity: 0.4;
}
</style>
