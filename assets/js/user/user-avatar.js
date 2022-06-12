$(function () {
  //layui弹出层
  let layer = layui.layer;

  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  //上传功能
  $("#btnChooseImage").on("click", function (e) {
    $("#file").click();
  });
  //监听file的上传事件
  $("#file").on("change", function (e) {
    let fileList = e.target.files;
    if (fileList.length === 0) {
      return layer.msg("请选择照片");
    }
    //将上传的img文件替换掉裁剪区域的img文件
    let newImgURL = URL.createObjectURL(fileList[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  $("#btnIpload").on("click", function () {
    //   获取裁剪过后的图片
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
      type: "PATCH",
      url: "/my/update/avatar",
      data: { avatar: dataURL },
      success(res) {
        if (res.code !== 0) {
          return layer.msg("头像更新失败");
        }
        layer.msg("头像更新成功");
        window.parent.getUser();
      },
    });
  });
});
