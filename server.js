"use strict";
let http = require("http");
let qs = require("querystring");
let fs = require("fs");
let url = require("url");

let port = 3000;
let students = new Set();
let ids = new Set();

fs.readFile("./students", "utf8", (err, data) => {
	let arr = data.split("$");
	for (let i = arr.length - 1; i >= 0; --i) students.add(arr[i]);
});
fs.readFile("./ids", "utf8", (err, data) => {
	let arr = data.split("$");
	for (let i = arr.length - 1; i >= 0; --i) ids.add(arr[i]);
});

let server = http.createServer((req, res) => { // req: 请求数据，res：输出数据
	let data = "";
	req.on("data", d => data += d); // 监听读数据
	req.on("end", () => { // 监听数据结束 (上面的结束)
		let pathname = url.parse(req.url).pathname; // 获取路径
		if (pathname == '/' && req.method == 'GET') { // GET "/"
			res.writeHead(200, {
				"Content-Type": "text/html",
				"Access-Control-Allow-Origin": "*"
			}); // 设置 Header
			fs.readFile("./index.html", "utf8", (err, data) => {
				res.write(data);
				res.end();
			});
			return ;
		}
		if (pathname == '/client.js' && req.method == 'GET') { // GET "/client.js"
			res.writeHead(200, {
				"Content-Type": "text/plain",
				"Access-Control-Allow-Origin": "*"
			});
			fs.readFile("./client.js", "utf8", (err, data) => {
				res.write(data);
				res.end();
			});
			return ;
		}
		let {name, id, fx} = qs.parse(data);
		console.log(`name: ${name}, id: ${id}, fx: ${fx}`);
		if (!name || !id || !fx) {
			res.write("missing params");
			res.end();
			return ;
		}
		res.writeHead(200, {
			"Content-Type": "text/plain",
			"Access-Control-Allow-Origin": "*"
		}); // 设置 Header
		if (!students.has(name) && !ids.has(id)) {
			students.add(name), ids.add(id);
			fs.appendFile("./students", name + "$", err => {});
			fs.appendFile("./ids", id + "$", err => {});  // 写文件
			fs.appendFile("./results", `${name} ${id} ${fx == 1 ? '机器人' : (fx == 2) ? '机械' : '控制'}\n`, err => {});
			res.write(`OK, ${name}(${id})`);
		} else {
			res.write(`No, already submitted, ${name}(${id})`); // 输出数据到客户端
		}
		res.end(); // 结束输出
	});
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});