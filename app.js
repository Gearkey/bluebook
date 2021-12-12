const http = require("http");
const host = "localhost";
const port = "8888";
const template = require("art-template");
// const cookie_parser = require("cookie-parser");

const app = require("./control/app_router"); // 软件的路由基础
const app_init = require("./control/app_init"); // 建立初始数据表及数据库相关操作
const app_login = require("./control/app_login"); // 登录/注册的逻辑
const app_conf = require("./control/app_conf"); // 软件配置项的操作逻辑
const main_material = require("./control/main_material"); // 任务卡片的操作逻辑
const main_material_area = require("./control/main_material_area"); // 任务卡片区域的操作逻辑
const main_material_detail = require("./control/main_material_detail"); // 任务详情的操作逻辑
const main_material_operation_button = require("./control/main_material_operation_button"); // 任务详情按钮的操作逻辑
const main_material_operation_form = require("./control/main_material_operation_form"); // 任务详情表单的操作逻辑
const main_material_table = require("./control/main_material_table"); // 任务详情表格的操作逻辑
const mine_uaer_info = require("./control/mine_uaer_info"); // 用户资料信息卡的操作逻辑
const mine_group_info = require("./control/mine_group_info");  // 团队资料信息卡的操作逻辑

const server = http.createServer(app);
const theme_path = __dirname + "/theme/default/";

app.get("/", (req, res) => {
    let app_login_obj = new app_login;
    
    /* 判断是否未登录，已登录继续，未登录跳转到 login */
    if (app_login_obj.is_not_login()){
        // todo
    }

    // fixme
    let app_init_obj = new app_init();
    connection = app_init_obj.get_database_connection();
    //materials = get_all_material();
    
    // 通过 art-template 拼合模板内容
    html = template(
        theme_path + "index.html",{
            app_title: "Bluebook",
            app_link: "https://github.com/gearkey/bluebook",
            app_licence_link: "https://github.com/gearkey/bluebook/blob/master/LICENSE",
            app_header_home: "首页",
            app_header_outside: "外部",
            app_header_mine: "我的",
            material_area_title_opened: "已开启的任务",
            material_area_title_voting: "表决中的任务",
            material_area_title_doing: "进行中的任务",
            material_area_title_feedback_in_progress: "反馈中的任务",
            material_area_title_finished: "已完成的任务",
            material_title: "任务标题",
            material_content: "任务内容",
            material_desc: "任务预览内容",
            material_desc_time: "任务预览时间",
            material_detail_sub_title: "任务详情子标题",
            material_detail_connection_tree: "物料/任务关系表",
            material_detail_material_info: "物料/任务属性表",
            material_detail_vote_info: "物料/任务投票信息表",
            material_detail_trigger_process : "任务触发流程表",
            material_detail_operation_history: "任务操作历史记录表",
            group_detail_flow_info: "团队资金流水表",
            material_operation_support: "▲",
            material_operation_oppose: "▼",
            material_operation_split: "拆解",
            material_operation_automate: "自动化",
            material_operation_modify: "修改",
            material_operation_finish: "完成",
            material_operation_cancel: "x",
            material_operation_form_title: "操作表单标题",
            material_operation_form_content: "操作表单内容"
        }
    )
    
    res.write(html);
    res.end()
});

app.get("/login", (req, res) => {
    html = template(
        theme_path + "login.html",{
            login_title: "登录到 Bluebook",
            login_desc: "欢迎来到 Bluebook 的世界，从此开始愉悦生活",
            login_input_username: "用户名/邮箱/电话",
            login_input_password: "输入密码",
            login_input_password_again: "再次输入密码",
            login_input_referee: "推荐人用户名/邮箱/电话",
            login_button_text: "登录",
            login_i_want_register: "我要注册"
        },
    )
    res.write(html);
    res.end()
});

app.get("/style.css", (req, res) => {
    css = template(theme_path + "style.css", {})
    res.write(css);
    res.end()
});

app.get("/main.js", (req, res) => {
    css = template(theme_path + "main.js", {})
    res.write(css);
    res.end()
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});