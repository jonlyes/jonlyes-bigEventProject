//Ajax拦截器
$.ajaxPrefilter((option) => {
  // 在发起真正的Ajax请求之前拼接请求字段
  option.url = "http://www.liulongbin.top:3008" + option.url;
  // 在发起真正的Ajax请求之前为所有需要权限的接口设置headers请求头
  if (option.url.indexOf("/my/") !== -1) {
    option.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  option.complete = function (res) {
    if (
      res.responseJSON.code === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //强制清除本地存储 token 值
      localStorage.removeItem("token");
      //强制跳转登录页面
      location.href = "/loging.html";
    }
  };
});
