const url = require("url");

function create_application(){
    this.get = {};
    this.post = {};

    const app = (req, res) => {
        let pathname = url.parse(req.url).pathname;
        let method = req.method.toLowerCase();

        if (this[method][pathname]){
            if (method === "get"){
                this[method][pathname](req, res);
            }
            else {
                let params = "";
                req.on("data", chunk => {
                    params += chunk;
                });
                req.on("end", () => {
                    req.body = params;
                    this[method][pathname](req, res);
                })
            }
        }
        else {
            res.end("404");
        }
    };

    app.get = (url, cb) => {
        this.get[url] = cb;
    };
    app.post = (url, cb) => {
        this.post[url] = cb;
    };

    return app;
}

module.exports = create_application();