function app_init(){
    this.get_database_connection = function (){
        let mysql = require("mysql");
        let connection = mysql.createConnection({
            host: "localhost:3306",
            user: "root",
            password: "root",
            database: "bluebook"
        });
        connection.connect();
        console.log("ok")

        return connection;
    };

    this.creat_database_init = function (){
        connection = this.get_database_connection()

        let sqls = [
            "create database bluebook;",
            
            /* 团队对象信息表 */
            "create table group_info (" +
                "group_id uuid, " + // 团队/用户id
                "group_tel varchar, " + // 团队/用户电话
                "group_email varchar, " + // 团队/用户邮箱
                "group_password varchar, " + // 团队/用户密码（加盐非对称加密储存）
                "group_name varchar, " + // 团队/用户名称
                "group_desc varchar, " + // 团队/用户简介
                "group_avatar varchar, " + // 团队/用户头像（储存uri）
                "group_realname varchar, " + // 团队全名/用户实名（加盐对称加密储存）
                "group_identity_no varchar, " + // 团队社会认证号码/用户身份证号（加盐对称加密储存）
                "group_default_vote_pass_percent tinyint, " + // 团队默认投票自动通过的百分比阈值
                "group_default_vote_power_percent tinyint, " + // 团队默认投票自动通过的百分比阈值（group_default_vote_pass_percent，int）
                "group_surplus decimal(14,4), " + // 团队节余/用户余额（精确到厘位）
                "group_state tinyint, " + // 团队/用户状态（0-正常，1-关闭，2-封禁，3-死亡，4-注销）
                "group_for_parent_status varchar" + // 用户/团队相对父团队的身份
            ");",

            /* 用户/子团队与父团队，多对多关系表 */
            "create table group_connection (" +
                "group_connection_id uuid, " + // 关系id
                "group_id uuid, " + // 用户/子团队id
                "group_parent uuid, " + // 父团队id
            ");",

            /* 团队物料/任务表 */
            "create table group_material (" +
                "material_id uuid, " + // 物料/任务 id
                "material_name varchar, " + // 物料名称/任务标题
                "material_desc varchar, " + // 物料/任务简介
                "material_unit varchar, " + // 物料/任务单位
                "material_unit_production_time decimal(13,3), " + // 物料/任务单位生产时间（秒数，精确到毫秒，以100年计算，整数部分需要10位，可以支持到最多300年）
                "material_unit_cluster int, " + // 物料/任务单位簇，以此大单位加减数量
                "material_estimated_count int, " + // 物料/任务预估数量
                "material_need_count int, " + //物料/任务需求数量
                "material_plan_count int, " + //物料/任务计划数量
                "material_real_count int, " + // 物料/任务实际数量
                "material_surplus_count int, " + // 物料/任务剩余数量
                "material_group_need varchar, " + // 物料/任务的需求团队
                "material_group_made varchar, " + // 物料/任务的生产团队
                "material_group_manage varchar, " + // 物料管理员/任务队长
                "material_is_rejected_by_one_vote boolean, " + // 物料/任务是否已被一票否决
                "material_state tinyint, " + // 物料/任务状态（0-草稿，1-触发，2-开启，3-需选，4-产选，5-生产，6-分配，7-反馈，8-完成，9-倾销，10-已销，11-取消，12-暂停）
                "material_priority tinyint, " + // 物料/任务优先级（0-中，1-高，2-低）
                "material_vote_pass_percent tinyint, " + // 物料/任务自动投票通过的百分比阈值
                "material_vote_power_percent tinyint, " + // 物料/任务可否决一票否决的百分比阈值（反否阈值）
                "material_harvest_percent tinyint, " + // 物料/任务过剩成果保留给生产团队集体的百分比值
                "material_is_outside boolean" + // 是否团队外部物料/任务（可能可以化简）
                "material_for_parent_status varchar, " + // 物料/任务相对父物料/任务的身份
            ");",
            
            /* 物料任务多对多关系表 */
            "create table group_material_connection (" + 
                "material_connection_id uuid, " + // 物料任务对应id
                "material_id varchar uuid, " + // 物料/任务id
                "material_parent uuid, " + // 父物料/任务id
            ");",

            /* 团队投票决策表 */
            "create table group_vote (" + 
                "vote_id uuid, " + // 选票id
                "vote_material uuid, " + // 选票对应物料/任务
                "vote_group uuid, " + // 投票对象id
                "vote_is_support boolean, " + // 投票对象是否支持此任务（false 反对，true 支持）
                "vote_desc varchar, " + // 投票原因表述
                "vote_need_count int, " + // 投票对象需要的物料/任务数量
                "vote_is_vote_power boolean, " + // 是否行使一票否决权（false 不行使，true 行使）
                "vote_is_feedback boolean, " + // 投票对象是否需要在获得结果后反馈（false 不需要，true 需要）
                "vote_feedback_is_satisfied boolean, " + // 投票对象对此物料/任务的结果是否满意（false 不满意，true 满意）
                "vote_feedback_desc varchar, " + // 投票对象对此选票的反馈内容
            ");",

            /* 触发/操作信息表 */
            "create table group_operation_info (" + 
                "operation_id uuid, " + // 操作id
                "operation_target varchar, " + // 操作对象（group_id / material_id / vote_id）
                "operation_state_change tinyint, " + // 将物料/任务的状态变更为（对应到对象的状态代码）
                "operation_touch_off_reach_time timestamp, " + // 触发条件：到达某个时间
                "operation_touch_off_reach_material_state tinyint, " + // 触发条件：物料/任务到达某个状态（reach_material_state，int，对应到 material_state）
                "operation_time timestamp, " + // 操作时间
                "operation_group uuid, " + // 操作人
                "operation_ip varchar, " + // 操作ip
                "operation_ua varchar, " + // 操作ua
                "operation_remark varchar, " + // 操作备注
            ");",

            /* 软件配置表 */
            "create table app_conf (" + 
                "conf_key varchar, " + // 配置项id
                "conf_value varchar, " + // 配置项值
            ");",

            /* 团队资金流水表 */
            "create table group_flow (" + 
                "flow_id uuid, " + // 流水id
                "flow_material uuid, " + // 流水对应的物料/任务id
                "flow_inside_group uuid, " + // 内部交易对象
                "flow_outside_group uuid, " + // 外部交易对象
                "flow_pay_type tinyint, " + // 流水支付方式（0-现金，1-信用卡，2-储蓄卡，3-云闪付，4-支付宝，5-微信）
                "flow_pay_card_number varchar, " + // 外部交易对象银行卡号/支付软件id
                "flow_pay_amount decimal(14,4), " + // 流水支付金额（精确到厘）
                "flow_serial_no varchar, " + // 外部交易支付方式提供的流水号
                "flow_invoice_no varchar, " + // 外部交易的发票号
            ");",

            /* 外部交易对象表 */
            "create table outside_group (" + 
                "outside_group_id uuid, " + // 外部交易对象id
                "outside_group_tel varchar, " + // 外部交易对象电话
                "outside_group_email varchar, " + // 外部交易对象邮箱
                "outside_group_name varchar, " + // 外部交易对象名称
                "outside_group_desc varchar, " + // 外部交易对象简介
                "outside_group_realname varchar, " + // 外部交易对象全名
                "outside_group_identity_no varchar, " + // 外部交易对象社会认证号码/身份证号
                "outside_group_surplus decimal(14,4), " + // 预估其货币价值
                "outside_group_state tinyint, " + // 外部交易对象状态（0-正常，1-关闭，2-黑名单）
                "outside_group_for_parent_state varchar, " + // 子交易对象相对父交易对象的身份（，varchar）
                ");",

            /* 外部交易对象关系表 */
            "create table outside_group_connection (" + 
                "outside_group_connection_id uuid, " + // 关系id
                "outside_group_id uuid, " + // 子交易对象id
                "outside_group_parent uuid, " + // 父交易对象id
            ");",

            /* 外部对象操作信息表 */
            "create table outside_group_operation_info (" + 
                "operation_id uuid, " + // 操作id
                "operation_target varchar, " + // 操作对象（group_id / material_id / vote_id）
                "operation_state_change tinyint, " + // 将物料/任务的状态变更为（对应到对象的状态代码）
                "operation_touch_off_reach_time timestamp, " + // 触发条件：到达某个时间
                "operation_touch_off_reach_material_state tinyint, " + // 触发条件：物料/任务到达某个状态（reach_material_state，int，对应到 material_state）
                "operation_time timestamp, " + // 操作时间
                "operation_group uuid, " + // 操作人
                "operation_ip varchar, " + // 操作ip
                "operation_ua varchar, " + // 操作ua
                "operation_remark varchar, " + // 操作备注
            ");",
        ]

        // fixme：因为模块的连接问题，不知道它能不能正常执行，之后应该测试并修复它
        for (i=0; ;i++){
            connection.query(sqls[i], function (result){
                console.log("sql_execute_success: " + result)

                connection.end();
            });
        }
    };

    this.creat_ex_database_init = function (){
        // todo：建立软件的基础扩展表
    };
}

module.exports = app_init();