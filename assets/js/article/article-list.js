$(function () {
  //弹出层
  let layer = layui.layer;
  //b表单模块
  let form = layui.form;
  //分页模块
  let laypage = layui.laypage;
  //查询对象，请求数据的时候提交到服务器
  let query = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };

  initTable();
  initCate();

  //获取文章列表函数
  function initTable() {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: query,
      success(res) {
        if (res.code !== 0) {
          return layer.msg("获取文章列表失败");
        }
        // 遍历格式化时间
        res.data.forEach((item) => {
          item.pub_date = formatDate(item.pub_date);
        });
        let cateStr = template("tpl-table", res);
        $("tbody").html(cateStr);
        initPage(res.total);
      },
    });
  }
  // 初始化文章分类的函数
  function initCate() {
    $.ajax({
      type: "GET",
      url: "/my/cate/list",
      success(res) {
        if (res.code !== 0) {
          return layer.msg("获取文章分类失败");
        }
        //使用模板引擎渲染分类的可选项
        let cateStr = template("tpl-cate", res);
        $("[name=cate_id]").html(cateStr);
        // 调用form模块的render方法重新渲染ui结构
        form.render();
      },
    });
  }
  //监听筛选区域的提交事件
  $("#formSelect").on("submit", function (e) {
    //清除浏览器的默认提交行为
    e.preventDefault();
    // //将文章的分类和状态赋值给query对象
    query.cate_id = $("[name=cate_id]").val();
    query.state = $("[name=state]").val();
    //根据最新的query查询对象重新渲染文章分类列表
    initTable();
  });
  // 监听编辑按钮弹出信息框
  $("tbody").on("click", "#tableEditor", function () {
    // 获取到要编辑的id
    let id = $(this).attr("data-id");
    cateEditor(id);
  });
  //监听删除按钮弹出询问框
  $("tbody").on("click", "#tableDel", function () {
    //获取到要删除数据的id
    let id = $(this).attr("data-id");
    layer.confirm(
      "此操作将永久删除该文章，是否继续？",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          type: "DELETE",
          url: "/my/article/info" + `?id=${id}`,
          success(res) {
            if (res.code !== 0) {
              return layer.msg("删除数据失败");
            }
            layer.msg("删除数据成功");
            initTable();
          },
        });
        layer.close(index);
      }
    );
  });
  // 渲染分页效果
  function initPage(total) {
    //执行一个laypage实例
    laypage.render({
      elem: "paging", //这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: query.pagesize, //每页显示的条数
      curr: query.pagenum, //默认选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页切换时触发的回调函数
      jump: function (obj, first) {
        //首次不执行，判断jump是否由点击页码调用的，防止出现死循环
        if (!first) {
          // 将当前的页面码赋值到query对象的pagenum值上
          query.pagenum = obj.curr;
          //将当前的显示条数赋值到query对象的pagesize值上
          query.pagesize = obj.limit;
          //调用initTable重新渲染表格
          initTable();
        }
      },
    });
  }
  // 格式化时间
  function formatDate(time) {
    var date = new Date(time);

    var year = date.getFullYear(),
      month = padZero(date.getMonth() + 1), //月份是从0开始的
      day = padZero(date.getDate()),
      hour = padZero(date.getHours()),
      min = padZero(date.getMinutes()),
      sec = padZero(date.getSeconds());
    var newTime =
      year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return newTime;
  }
  // 封装补零函数
  function padZero(num) {
    return num > 9 ? num : "0" + num;
  }
  // 封装编辑修改文章页面框的方法
  function cateEditor(id) {
    //弹出层的索引值
    let indexEditor = null;
    //声明三个变量供裁剪区域模块使用
    let $image = null;
    let options = null;
    //文章的发布状态
    let cateState = "已发布";
    // 弹出页面框
    indexEditor = layer.open({
      title: "编辑修改文章",
      type: 1,
      area: ["1200px", "500px"],
      content: $("#articleEditor").html(),
      //点击右上角的关闭按钮触发的回调函数
      cancel: function () {
        // 清除富文本编辑器
        initEditor(true);
      },
    });

    //根据id获取文章信息并渲染表单
    $.ajax({
      type: "GET",
      url: "/my/article/info",
      data: { id },
      success(res) {
        if (res.code !== 0) {
          return layer.msg("加载文章失败");
        }
        form.val("form-cateEditor", res.data);
        $("#formPub [name=cate_name]").html(res.data.cate_name);
        //将获取到的cover_img设置到 #image 容器里
        $("#image").attr(
          "src",
          "http://www.liulongbin.top:3008" + res.data.cover_img
        );
        // 1. 初始化图片裁剪器
        $image = $("#image");
        // 2. 裁剪选项
        options = {
          aspectRatio: 400 / 280,
          preview: ".img-preview",
        };
        // 3. 初始化裁剪区域
        $image.cropper(options);
        form.render();
        // 初始化富文本编辑器
        initEditor();
      },
    });
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
    $("#formPub").on("submit", function (e) {
      //清除浏览器的默认提交行为
      e.preventDefault();
      // 基于form表单，参加FormData对象
      let editorFd = new FormData($(this)[0]);
      //将文章的state添加到FormData对象中
      editorFd.append("state", cateState);
      // 将文章的id添加到FormData对象中
      editorFd.append("id", id);
      $image
        .append("state", cateState)
        .cropper("getCroppedCanvas", {
          width: 400,
          height: 280,
        })
        .toBlob(function (blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          //将blob格式的文件对象添加到FormData对象中
          editorFd.append("cover_img", blob);
          $.ajax({
            type: "PUT",
            url: "/my/article/info",
            // 如果想服务器提交的是FormData格式的数据，必须添加以下两个配置属性
            contentType: false,
            processData: false,
            data: editorFd,
            success(res) {
              if (res.code !== 0) {
                return layer.msg(res.message);
              }
              layer.msg(res.message);
              //关闭弹出层
              layer.close(indexEditor);
              // 清除富文本编辑器
              initEditor(true);
            },
          });
        });
    });
  }
});
