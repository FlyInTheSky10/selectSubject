 "use strict";
let submitDOM = document.getElementById("submit");
let lastTime = new Date();
let flag = 0;
submitDOM.addEventListener("click", submitData);
function submitData() {
	let formDOM = document.getElementById("form");
	let nameDOM = document.getElementsByName("name");
	let idDOM = document.getElementsByName("id");
	let fxDOM = document.getElementsByName("fx");
	let data = {
		name: nameDOM[0].value,
		id: idDOM[0].value,
		fx: -1
	};
	for (let i = fxDOM.length - 1; i >= 0; --i) {
		if (fxDOM[i].checked) {
			data.fx = fxDOM[i].value;
			break ;
		}
	}
	if (data.name === '' || data.id === '' || data.fx === -1) {
		alert("Not fill enough");
		return ;
	}
	//console.log(data);
	let encodeString = encodeObj(data);
	//console.log(encodeString.substring(0, encodeString.length - 1));
	let nowTime = new Date();
	if (flag && nowTime.getTime() - lastTime.getTime() <= 2000) {
		alert("slow!");
	} else {
		ajax("POST", "http://127.0.0.1:3000", encodeString.substring(0, encodeString.length - 1));	
		lastTime = new Date();
		flag = 1;
	}
}
function encodeObj(obj) {
	let retdata = "";
	Object.keys(obj).forEach(key => {
		retdata += key + "=" + obj[key] + "&";
	});
	return retdata;
}
// 封装的ajax方法
function ajax(method, url, val) { // 方法，路径，传送数据
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
				alert(xhr.responseText);
			} else {
				alert('Request was unsuccessful: ' + xhr.status);
			}
		}
	};
	xhr.open(method, url, true); 
	if (val) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		xhr.send(val);
	} 
}