<template>
  <div class="drawer-con">
    <div class="login-con">
      <p>登录网易云音乐</p>
      <p>手机电脑多端同步，尽享海量高品质音乐</p>
      <a class="login-btn">立即登录</a>
    </div>
    <div class="more-items">
      <div class="icons">
        <div class="icon-item">
          <a class="icon-img icon-msg"></a
          ><span class="icon-text">我的消息</span>
        </div>
        <div class="icon-item">
          <a class="icon-img icon-friend"></a
          ><span class="icon-text">我的消息</span>
        </div>
        <div class="icon-item">
          <a class="icon-img icon-skin"></a
          ><span class="icon-text">我的消息</span>
        </div>
        <div class="icon-item">
          <a class="icon-img icon-song"></a
          ><span class="icon-text">我的消息</span>
        </div>
      </div>
      <div class="vux-1px-b"></div>
      <div class="drawer-list">
        <p class="list-item"><a class="list-icon icon-piao"></a>演出</p>
        <p class="list-item"><a class="list-icon icon-shop"></a>商城</p>
        <p class="list-item"><a class="list-icon icon-people"></a>附近的人</p>
        <p class="list-item"><a class="list-icon icon-ring"></a>口袋彩铃</p>
        <p class="list-item"><a class="list-icon icon-order"></a>我的订单</p>
      </div>
      <div class="vux-1px-b"></div>
      <div class="drawer-list">
        <p class="list-item"><a class="list-icon icon-stop"></a>定时停止播放</p>
        <p class="list-item"><a class="list-icon icon-qr"></a>扫一扫</p>
        <p class="list-item"><a class="list-icon icon-clock"></a>音乐闹钟</p>
        <p class="list-item">
          <a class="list-icon icon-free"></a>在线听歌免流量
        </p>
        <p class="list-item"><a class="list-icon icon-game"></a>游戏推荐</p>
        <p class="list-item"><a class="list-icon icon-coupon"></a>优惠券</p>
      </div>
      <div class="drawer-bottom">
        <div class="vux-1px-b"></div>
        <div class="bottom-con">
          <p class="list-item"><a class="list-icon icon-moon"></a>夜间模式</p>
          <p class="list-item"><a class="list-icon icon-set"></a>设置</p>
          <p class="list-item"><a class="list-icon icon-exit"></a>退出</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Drawer"
};
</script>

<style scoped lang="less">
.drawer-con {
  width: 100%;
  overflow-y: auto;
  position: relative;
  height: calc(100vh - 1.4rem);
}
.login-con {
  background-color: #ebebeb;
  text-align: center;
  font-size: 0.347rem;
  color: #999;
  height: 3.2rem;
  padding-top: 1.067rem;
  .login-btn {
    margin: 0.533rem auto 0 auto;
    display: block;
    box-sizing: border-box;
    border: 0.027rem solid #c8c8c8;
    border-radius: 0.4rem;
    height: 0.8rem;
    line-height: 0.8rem;
    width: 3.333rem;
  }
}
.icons,
.bottom-con {
  display: flex;
  align-items: center;
}
.icons {
  height: 2.48rem;
  padding: 0 0.4rem;
  font-size: 0.32rem;
}
.icon-item {
  width: 1.867rem;
  text-align: center;
}
.icon-img {
  display: block;
  height: 0.8rem;
  width: 0.8rem;
  margin: 0 auto;
  background-size: 100%;
  background-repeat: no-repeat;
}
.drawer-list {
  padding: 0.267rem 0;
}
.list-item {
  padding-left: 0.533rem;
  font-size: 0.4rem;
  height: 1.2rem;
  line-height: 1.2rem;
}
.list-icon {
  display: inline-block;
  height: 0.6rem;
  width: 0.6rem;
  background-size: 100%;
  vertical-align: middle;
  margin-top: -2px;
  margin-right: 0.267rem;
}
.drawer-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.bottom-con {
  height: 1.4rem;
  margin-top: -0.013rem;
  .list-item {
    height: auto;
    line-height: 1.4rem;
    margin-right: 0.133rem;
  }
  .list-icon {
    display: inline-block;
    height: 0.6rem;
    width: 0.6rem;
  }
}
.icon-msg {
  background-image: url("../assets/img/b9l.png");
}
.icon-friend {
  background-image: url("../assets/img/b9h.png");
}
.icon-skin {
  background-image: url("../assets/img/b9q.png");
}
.icon-song {
  background-image: url("../assets/img/b9a.png");
}
.icon-piao {
  background-image: url("../assets/img/b9t.png");
}
.icon-shop {
  background-image: url("../assets/img/b9s.png");
}
.icon-people {
  background-image: url("../assets/img/b9n.png");
}
.icon-ring {
  background-image: url("../assets/img/b99.png");
}
.icon-order {
  background-image: url("../assets/img/b9r.png");
}
.icon-stop {
  background-image: url("../assets/img/b9u.png");
}
.icon-qr {
  background-image: url("../assets/img/b9z.png");
}
.icon-clock {
  background-image: url("../assets/img/b9b.png");
}
.icon-free {
  background-image: url("../assets/img/b9g.png");
}
.icon-game {
  background-image: url("../assets/img/b9i.png");
}
.icon-coupon {
  background-image: url("../assets/img/b9e.png");
}
.icon-moon {
  background-image: url("../assets/img/b9o.png");
}
.icon-set {
  background-image: url("../assets/img/b9p.png");
}
.icon-exit {
  background-image: url("../assets/img/b9f.png");
}
</style>
