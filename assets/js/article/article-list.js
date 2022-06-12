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
        layer.msg("获取文章分类成功");
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
});
