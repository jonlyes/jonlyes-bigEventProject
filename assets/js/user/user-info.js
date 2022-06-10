$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    //   用户昵称在6-12字符之间
    nickname: [
      /^[a-zA-Z][a-zA-Z0-9_.]{3,11}$/,
      "用户名只能以字母开头，4-12字节，字母数字下划线",
    ],
  });

  //初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success(res) {
        if (res.code !== 0) {
          return layer.msg("获取用户信息失败");
        }
        // 调用layui的form.val()给表单快速赋值
        form.val("userFormInfo", res.data);
      },
    });
  }
  initUserInfo();

  $(".layui-form").on("submit", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    // 修改更新用户信息
    $.ajax({
      type: "PUT",
      url: "/my/userinfo",
      data: form.val("userFormInfo"),
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("更新用户信息失败");
        }
        layer.msg("更新用户信息成功");
        //通过window.parent调用父页面的方法重新获取和渲染用户信息;
        window.parent.getUser();
      },
    });
  });
  //重置表单信息
  $("#reset").on("click", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    // 调用initUserInfo重新发起Ajax请求
    initUserInfo();
  });
});
