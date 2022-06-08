$(function () {
  // 跳转注册表单
  $(".box-log").on("click", ".link-res", () => {
    //   删除登录表单
    $(".logForm").remove();
    // 在box - log添加后面添加注册表单;
    $(".box-log").append(`
    <form class="layui-form regForm" id="form_reg">
            <!-- 注册表单区域 -->
            <div class="layui-form-item regItem">
                <i class="layui-icon layui-icon-username"></i>
                <input type="text" name="username" required lay-verify="required|username" autocomplete="off"
                    placeholder="请输入账号" class="layui-input iptPadding">
            </div>
            <div class="layui-form-item regItem">
                <i class="layui-icon layui-icon-password"></i>
                <input type="password" name="password" autocomplete="off" required lay-verify="required|password"
                    placeholder="请输入密码" class="layui-input iptPadding">
            </div>
            <div class="layui-form-item regItem">
                <i class="layui-icon layui-icon-password"></i>
                <input type="password" name="repassword" autocomplete="off" required
                    lay-verify="required|password|repassword" placeholder="请再次输入密码" class="layui-input iptPadding">
            </div>
            <div class="layui-form-item formLogBtn">
                <button class="layui-btn layui-btn-fluid layui-btn-normal regBtn" lay-submit>注册</button>
            </div>
            <div class="layui-form-item links">
                <a href="javascript:;" class="link-log">去登录</a>
            </div>
        </form>
`);
  });

  // 跳转登录表单
  $(".box-log").on("click", ".link-log", () => {
    //   删除注册表单
    $(".regForm").remove();
    // 在box - log添加后面添加登录表单;
    $(".box-log").append(`
    <form class="layui-form logForm" id="form_log">
    <!-- 登录表单区域 -->
    <div class="layui-form-item logItem">
        <i class="layui-icon layui-icon-username"></i>
        <input type="text" name="username" required lay-verify="required|username" autocomplete="off"
            placeholder="请输入账号" class="layui-input iptPadding">
    </div>
    <div class="layui-form-item logItem">
        <i class="layui-icon layui-icon-password"></i>
        <input type="password" name="password" required lay-verify="required|password" autocomplete="off"
            placeholder="请输入密码" class="layui-input iptPadding">
    </div>
    <div class="layui-form-item formLogBtn">
        <button class="layui-btn layui-btn-fluid layui-btn-normal logBtn" lay-submit>登录</button>
    </div>
    <div class="layui-form-item links">
        <a href="javascript:;" class="link-res">去注册</a>
    </div>
</form>
`);
  });
  //form表单验证
  let form = layui.form;
  form.verify({
    // 用户名匹配
    username: [
      /^[a-zA-Z][a-zA-Z0-9_]{3,11}$/,
      "用户名只能以字母开头，4-12字节，字母数字下划线",
    ],
    //密码匹配
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //判断两次密码是否一致
    respassword: function (value) {
      let pwd = $(".regForm [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });

  //layui弹出信息框
  let layer = layui.layer;

  // //监听登录表单的提交事件
  $("body").on("submit", "#form_log", (e) => {
    //清除浏览器的默认提交行为
    e.preventDefault();
    //发送POST请求
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: {
        username: $("#form_log [name=username]").val(),
        password: $("#form_log [name=password]").val(),
      },
      success: function (res) {
        if (res.code !== 0) return layer.msg(res.message); //弹出信息框
        layer.msg("登录成功！"); //弹出信息框

        //保存token到本地存储
        localStorage.setItem("token", res.token);

        //跳转到index页面
        location.href = "/index.html";
      },
    });
  });

  // 监听注册表单的提交事件
  $("body").on("submit", "#form_reg", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    //发送POST请求
    $.ajax({
      type: "POST",
      url: "/api/reg",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
        repassword: $("#form_reg [name=repassword]").val(),
      },
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg(res.message); //弹出信息框
        }
        layer.msg("注册成功，请登录！"); //弹出信息框
        // 触发去登录的点击事件，注册成功就跳转到登录页面
        $(".link-log").click();
      },
    });
  });
});
