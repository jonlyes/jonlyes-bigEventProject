$(function () {
  // 判断本地存储是否有 image 值，有则渲染到头像
  if (localStorage.getItem("iamge")) {
    $(".layui-nav-img").attr("src", localStorage.getItem("iamge")).show();
    $(".text-avatar").hide();
  }
  //获取用户信息并渲染
  getUser();

  //用户退出
  $("body").on("click", ".btnLogout", function () {
    //layui弹出层
    let layer = layui.layer;
    layer.confirm(
      "确定退出登录？",
      { icon: 3, title: "提示" },
      function (index) {
        //清空本地存储 token 值
        localStorage.removeItem("token");
        //跳转到登录页面
        location.href = "/loging.html";
        // 关闭confirm询问框
        layer.close(index);
      }
    );
  });
});
// 获取用户信息并渲染
function getUser() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    success(res) {
      if (res.code !== 0) return console.log("用户信息获取失败");
      renderAvatar(res.data);
      if (res.data.user_pic) {
        localStorage.setItem("iamge", res.data.user_pic);
      }
    },
  });
}
//用户信息渲染函数
function renderAvatar(user) {
  //   获取用户名
  let userName = user.nickname || user.username;

  //渲染用户名
  $(".welcome").html("欢迎&nbsp&nbsp" + userName);
  // 渲染头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //将userName的第一个字转为大写字母
    let first = userName[0].toUpperCase();
    $(".text-avatar").html(first).show();
    $(".layui-nav-img").hide();
  }
}
