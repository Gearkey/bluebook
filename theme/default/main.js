/* 给 login.html 的绑定事件 */
function display_register_field(){
    document.getElementById("register_field").style.display = "block";
    document.getElementById("login_button").value = "注册";

    switch_link = document.getElementById("i_want_register");
    switch_link.innerText = "我要登录";
    switch_link.onclick = function(){hide_register_field()};
}

function hide_register_field(){
    document.getElementById("register_field").style.display = "none";
    document.getElementById("login_button").value = "登录";

    switch_link = document.getElementById("i_want_register");
    switch_link.innerText = "我要注册";
    switch_link.onclick = function(){display_register_field()};
}

/* 给 index.html 的绑定事件 */
function display_material_detail(){
    document.getElementById("cover").style.display = "block";
    document.getElementById("material_detail").style.display = "block";
}

function hide_material_detail(){
    document.getElementById("cover").style.display = "none";
    document.getElementById("material_detail").style.display = "none";
}

function display_material_operation_form(){
    let material_detail = document.getElementById("material_detail");
    let screen_width = document.body.clientWidth;
    if (screen_width > 1348){
        material_detail.style.width = "680px";
    }
    else if (screen_width > 1220){
        material_detail.style.width = "500px";
    }

    document.getElementById("material_operation_form").style.display = "block";
    document.getElementById("material_operation_focus_button").onclick = function(){hide_material_operation_form()};
}

function hide_material_operation_form(){
    let material_detail = document.getElementById("material_detail");
    let screen_width = document.body.clientWidth;
    if (screen_width > 1348){
        material_detail.style.width = "1100px";
    }
    else if (screen_width > 1220){
        material_detail.style.width = "800px";
    }
    
    document.getElementById("material_operation_form").style.display = "none";
    document.getElementById("material_operation_focus_button").onclick = function(){display_material_operation_form()};
}

function edit_material_detail_title(){
    document.getElementById("material_detail_title").readOnly=false
}

function edit_material_detail_content(){
    //todo
}
