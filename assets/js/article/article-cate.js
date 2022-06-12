$(function () {
  //layui的弹出层
  let layer = layui.layer;
  //表单模块
  let form = layui.form;
  //添加文章类别按钮弹出层的索引
  let indexAdd = null;
  //初始化并渲染table表格
  initAryCateList();
  //监听添加类别按钮的点击事件弹出layer.open页面框
  $("body").on("click", "#btnAddCate", function () {
    // 弹出页面框
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-addCate").html(),
    });
  });
  //监听添加文章类别的提交事件
  $("body").on("submit", "#formAdd", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    //发起ajax添加文章类别
    $.ajax({
      type: "POST",
      url: "/my/cate/add",
      data: $("#formAdd").serialize(),
      success(res) {
        if (res.code !== 0) {
          return layer.msg("添加文章类别失败");
        }
        layer.msg("添加文章类别成功");
        //关闭弹出层
        layer.close(indexAdd);
        //重新初始化渲染table表格
        initAryCateList();
      },
    });
  });

  //编辑文章类别按钮弹出层的索引
  let indexEditor = null;
  //监听编辑按钮的点击事件弹出layer.open页面框
  $("body").on("click", "#btnEditor", function () {
    // 弹出页面框
    indexEditor = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-editor").html(),
    });
    // 获取被点击的编辑按钮的id
    let id = $(this).attr("data-id");
    // 发起ajax获取id值的文章分类数据
    $.ajax({
      type: "GET",
      url: "/my/cate/info",
      data: { id },
      success(res) {
        if (res.code !== 0) {
          return layer.msg("获取数据失败");
        }
        form.val("form-editor", res.data);
      },
    });
  });
  //监听编辑文章类别的提交事件
  $("body").on("submit", "#formEditor", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    //发起ajax添加文章类别
    $.ajax({
      type: "PUT",
      url: "/my/cate/info",
      data: $(this).serialize(),
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("修改文章类别失败");
        }
        layer.msg("修改文章类别成功");
        //关闭弹出层
        layer.close(indexEditor);
        //重新初始化渲染table表格
        initAryCateList();
      },
    });
  });
  // 监听删除的点击事件按钮弹出询问框
  $("body").on("click", "#btnDel", function () {
    // 获取被点击的删除按钮的id
    let id = $(this).attr("data-id");
    //弹出询问框
    layer.confirm(
      "确认删除此分类吗?",
      { icon: 3, title: "提示" },
      function (index) {
        //发起ajax请求删除数据
        $.ajax({
          type: "DELETE",
          url: "/my/cate/del" + `?id=${id}`,
          success(res) {
            if (res.code !== 0) {
              return layer.msg("删除此分类失败");
            }
            layer.msg("删除成功");
            // 重新初始化并渲染表格
            initAryCateList();
          },
        });
        layer.close(index);
      }
    );
  });
});

//初始化并渲染table表格
function initAryCateList() {
  $.ajax({
    type: "GET",
    url: "/my/cate/list",
    success(res) {
      if (res.code !== 0) {
        return res.message;
      }
      let htmlStr = template("tpl-table", res);
      $("tbody").html(htmlStr);
    },
  });
}
