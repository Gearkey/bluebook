function app_login(){
    /* 判断当前是否未登录 */
    this.is_not_login = function (){
        // todo：填写逻辑，通过是否存在 cookie 判定
        return true;
    };
}

module.exports = app_login;