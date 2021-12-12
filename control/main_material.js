function main_material(){
    /* 获取所有任务卡片的 json 信息 */
    /* materials = [
        {material_name: "", material_desc:"", material_state:""},
        ...
    ]*/
    let get_all_material = function (){
        // 连接数据库
        connection = get_database_connection();

        // 获取用户所有任务的名称、简介和状态
        connection.query(
            "select material_name, material_desc, material_state from group_material" +
            "where need_material_group = <group_id> or made_material_group = <group_id>",
            
            function (error, results, fields){
                if (error) throw error;

                console.log('The solution is: ', results[0].solution);

                connection.end();
            }
        );

        return materials;
    };
}

module.exports = main_material();

