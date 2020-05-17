<template>
  <ResultPage
    page="user"
    :finished="finished"
    @user="scrollToBottom"
    :notfound="notfound"
    :loading="loading"
    :pullUp="pullUp"
    :scrollHeight="scrollHeight"
    @refresh="refresh"
  >
    <div ref="result">
      <ResultItem
        v-for="(item, index) in users"
        :key="index"
        mode="user"
        small
        :imgUrl="item.avatarUrl"
        :name="item.nickname"
        :signature="item.signature"
      ></ResultItem>
    </div>
  </ResultPage>
</template>

<script>
import ResultItem from "@/components/ResultItem";
import ResultPage from "@/components/ResultPage";

export default {
  name: "SearchUser",
  components: { ResultItem, ResultPage },
  data() {
    return {
      finished: false,
      notfound: false,
      loading: true,
      pullUp: false,
      page: 1,
      count: 0,
      scrollHeight: 0,
      name: "",
      users: []
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
  methods: {
    scrollToBottom() {
      this.finished = false;
      if (this.count > (this.page - 1) * 20) {
        this.pullUp = true;
        this.getData(this.$route.params.name);
      }
    },
    getData(key) {
      this.$fetch("/search", {
        keywords: key,
        type: 1002,
        limit: 20,
        offset: (this.page - 1) * 20
      })
        .then(data => {
          let result = data.result;
          if (!result.userprofileCount) {
            this.notfound = true;
            if (this.loading) {
              this.loading = false;
            }
            return;
          }
          if (this.count === 0) {
            this.count = result.userprofileCount;
          }
          this.users = this.users.concat(result.userprofiles);
          this.$nextTick(() => {
            this.scrollHeight = this.$refs.result.scrollHeight;
          });
          this.page += 1;
          if (this.loading) {
            this.loading = false;
          } else this.pullUp = false;
          this.finished = true;
        })
        .catch(err => {
          console.log(err);
          if (this.loading) {
            this.notfound = true;
            this.loading = false;
          }
          this.pullUp = false;
        });
    },
    refresh(key) {
      this.users = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.getData(key);
      this.name = key;
    }
  }
};
</script>

<style scoped></style>
