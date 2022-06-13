$(function () {
  // 弹出层
  let layer = layui.layer;
  //表单模块
  let form = layui.form;
  //文章的发布状态
  let cateState = "已发布";
  //调用加载文章分类函数
  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 1. 初始化图片裁剪器
  let $image = $("#image");

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);
  //监听选择封面按钮的点击事件
  $("#btnCover").on("click", function () {
    // 触发上传事件
    $("#fileCover").click();
  });
  //监听上传事件
  $("#fileCover").on("change", function (e) {
    let files = e.target.files;
    if (files.length === 0) {
      return layer.msg("请上传封面图片");
    }
    //将上传的图片替换到裁剪区域
    let newImage = URL.createObjectURL(files[0]);
    $image.cropper("destroy").attr("src", newImage).cropper(options);
  });

  // 监听发布按钮的点击事件
  $("#btnRelease").on("click", function () {
    cateState = "已发布";
  });
  // 监听草稿按钮的点击事件
  $("#btnDraft").on("click", function () {
    cateState = "草稿";
  });
  //监听表单的提交事件
  $("#formPub").on("submit", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    // 基于form表单，参加FormData对象
    let pubFd = new FormData($(this)[0]);
    //将文章的state添加到FormData对象中
    pubFd.append("state", cateState);
    $image
      .cropper("getCroppedCanvas", {
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        //将blob格式的文件对象添加到FormData对象中
        pubFd.append("cover_img", blob);
        pubListArticle(pubFd);
      });
  });
  //封装加载文章分类的函数
  function initCate() {
    $.ajax({
      typr: "GET",
      url: "/my/cate/list",
      success(res) {
        if (res.code !== 0) {
          return layer.msg("获取文章分类失败");
        }
        //调用渲染引擎渲染文章分类
        let cateStr = template("tpl-cate", res);
        $("[name=cate_id]").html(cateStr);
        // 调用表单模块的render方法重新渲染ui结构
        form.render();
      },
    });
  }
  //定义发布文章的方法
  function pubListArticle(fd) {
    $.ajax({
      type: "POST",
      url: "/my/article/add",
      // 如果想服务器提交的是FormData格式的数据，必须添加以下两个配置属性
      contentType: false,
      processData: false,
      data: fd,
      success(res) {
        if (res.code !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 发布文章后跳转到分类列表页面
        location.href = "/article/article-list.html";
      },
    });
  }
});
