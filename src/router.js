import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Player from "./views/Player";
import Detail from "./views/Detail";
import TopList from "./views/TopList";
import ListLabel from "./views/ListLabel";
import TopListPage from "./views/TopListPage";
import CatList from "./views/CatList";
import HistoryList from "./views/HistoryList";
import Search from "./views/search/Search";
import SearchHot from "./views/search/SearchHot";
import SearchDetail from "./views/search/SearchDetail";
import SearchResult from "./views/search/SearchResult";
import SearchSingle from "./views/search/SearchSingle";
import SearchSinger from "./views/search/SearchSinger";
import SearchAlbum from "./views/search/SearchAlbum";
import SearchList from "./views/search/SearchList";
import SearchDj from "./views/search/SearchDj";
import SearchVideo from "./views/search/SearchVideo";
import SearchUser from "./views/search/SearchUser";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/playlist",
      name: "playlist",
      component: Detail,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/player",
      name: "player",
      component: Player
    },
    {
      path: "/topList/:name",
      name: "topList",
      component: TopList,
      children: [
        {
          path: "",
          name: "top",
          component: TopListPage
        }
      ]
    },
    {
      path: "/label",
      name: "label",
      component: ListLabel
    },
    {
      path: "/catList",
      name: "catList",
      component: CatList
    },
    {
      path: "/history",
      name: "history",
      component: HistoryList
    },
    {
      path: "/search",
      component: Search,
      meta: {
        keepAlive: false
      },
      children: [
        {
          path: "",
          name: "hot",
          component: SearchHot
        },
        {
          path: "/search/detail/:name",
          component: SearchDetail,
          children: [
            {
              path: "result",
              name: "result",
              component: SearchResult
            },
            {
              path: "single",
              name: "single",
              component: SearchSingle
            },
            {
              path: "singer",
              name: "singer",
              component: SearchSinger
            },
            {
              path: "video",
              name: "video",
              component: SearchVideo
            },
            {
              path: "album",
              name: "album",
              component: SearchAlbum
            },
            {
              path: "list",
              name: "list",
              component: SearchList
            },
            {
              path: "dj",
              name: "dj",
              component: SearchDj
            },
            {
              path: "user",
              name: "user",
              component: SearchUser
            }
          ]
        }
      ]
    }
  ]
});
