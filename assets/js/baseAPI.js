//拼接Ajax请求url,方便后续维护
$.ajaxPrefilter((option) => {
  option = "http://www.liulongbin.top:3008" + option;
});
