$(function () {
  // 表单验证
  let form = layui.form;
  //layui弹出信息框
  let layer = layui.layer;
  form.verify({
    //密码匹配
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //判断新旧密码是否一致
    samepassword: function (value) {
      let pwd = $(".layui-form [name=old_pwd]").val();
      if (pwd === value) {
        return "新旧密码一致";
      }
    },
    //判断两次密码是否一致
    resNewPassword: function (value) {
      let pwd = $(".layui-form [name=new_pwd]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });
  //监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    // 清除浏览器的默认提交行为;
    e.preventDefault();
    //发起请求修改密码
    $.ajax({
      type: "PATCH",
      url: "/my/updatepwd",
      data: $(".layui-form").serialize(),
      success(res) {
        if (res.code !== 0) {
          return layer.msg("密码修改失败");
        }
        layer.msg("密码修改成功");
        //重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
});
