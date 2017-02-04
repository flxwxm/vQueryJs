(function () {
	window.sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	//判断IE浏览器
	if ((/msie ([\d.]+)/).test(ua)) {				
		s = ua.match(/msie ([\d.]+)/);
		sys.ie = s[1];
	}
	//判断火狐浏览器
	if ((/firefox\/([\d.]+)/).test(ua)) {			
		s = ua.match(/firefox\/([\d.]+)/);
		sys.firefox = s[1];
	}
	//判断谷歌浏览器
	if ((/chrome\/([\d.]+)/).test(ua)) {			
		s = ua.match(/chrome\/([\d.]+)/);
		sys.chrome = s[1];
	} 
	//判断opera浏览器
	if ((/opera.*version\/([\d.]+)/).test(ua)) {	
		s = ua.match(/opera.*version\/([\d.]+)/);
		sys.opera = s[1];
	}
	//判断safari浏览器
	if ((/version\/([\d.]+).*safari/).test(ua)) {	
		s = ua.match(/version\/([\d.]+).*safari/);
		sys.safari = s[1];
	} 
})();

//PS：以上的写法包含了大量的重复代码，进行一下压缩。

//浏览器检测
(function (){
	window.sys = {};   
	var ua = navigator.userAgent.toLowerCase();   
	var s=null;   
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :   
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :   
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :   
	(s = ua.match(/opera.*version\/([\d.]+)/)) ? sys.opera = s[1] :   
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0; 	
})();

//跨浏览器添加事件绑定
function addEvent(obj, type, fn) {
	if (typeof obj.addEventListener != 'undefined') {
		obj.addEventListener(type, fn, false);
	} else {
		//创建一个存放事件的哈希表(散列表)
		if (!obj.events) obj.events = {};
		//第一次执行时执行
		if (!obj.events[type]) {	
			//创建一个存放事件处理函数的数组
			obj.events[type] = [];
			//把第一次的事件处理函数先储存到第一个位置上
			if (obj['on' + type]) obj.events[type][0] = fn;
		} else {
			//同一个注册函数进行屏蔽，不添加到计数器中
			if (addEvent.equal(obj.events[type], fn)) return false;
		}
		//从第二次开始我们用事件计数器来存储
		obj.events[type][addEvent.ID++] = fn;
		//执行事件处理函数
		obj['on' + type] = addEvent.exec;
	}
}

//为每个事件分配一个计数器
addEvent.ID = 1;

//执行事件处理函数
addEvent.exec = function (event) {
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for (var i in es) {
		es[i].call(this, e);
	}
};

//同一个注册函数进行屏蔽
addEvent.equal = function (es, fn) {
	for (var i in es) {
		if (es[i] == fn) return true;
	}
	return false;
}

//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};


//跨浏览器删除事件
function removeEvent(obj, type, fn) {
	if (typeof obj.removeEventListener != 'undefined') {
		obj.removeEventListener(type, fn, false);
	} else {
		if (obj.events) {
			for (var i in obj.events[type]) {
				if (obj.events[type][i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
} 

//DOM ready方法一：
function ready(fn){
    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
            //注销事件, 避免反复触发
            document.removeEventListener('DOMContentLoaded',arguments.callee, false);
            fn();            //执行函数
        }, false);
    }else if(document.attachEvent) {        //IE
        document.attachEvent('onreadystatechange', function() {
            if(document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee);
                fn();        //函数执行
            }
        });
    }
};
//DOM ready方法二（加强）：
var whenReady = (function() {               //这个函数返回whenReady()函数
    var funcs = [];             //当获得事件时，要运行的函数
    var ready = false;          //当触发事件处理程序时,切换为true
     
    //当文档就绪时,调用事件处理程序
    function handler(e) {
        if(ready) return;       //确保事件处理程序只完整运行一次
         
        //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
        if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
            return;
        }
         
        //运行所有注册函数
        //注意每次都要计算funcs.length
        //以防这些函数的调用可能会导致注册更多的函数
        for(var i=0; i<funcs.length; i++) {
            funcs[i].call(document);
        }
        //事件处理函数完整执行,切换ready状态, 并移除所有函数
        ready = true;
        funcs = null;
    }
    //为接收到的任何事件注册处理程序
    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', handler, false);
        document.addEventListener('readystatechange', handler, false);            //IE9+
        window.addEventListener('load', handler, false);
    }else if(document.attachEvent) {
        document.attachEvent('onreadystatechange', handler);
        window.attachEvent('onload', handler);
    }
    //返回whenReady()函数
    return function whenReady(fn) {
        if(ready) { fn.call(document); }
        else { funcs.push(fn); }
    };
})();
//调用方法：whenReady(fn);

//DOM ready方法三（加强）：
function addDomLoaded(fn) {
	var isReady = false;
	var timer = null;
	function doReady() {
		if (timer) clearInterval(timer);
		if (isReady) return;
		isReady = true;
		fn();
	}
	
	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
		//无论采用哪种，基本上用不着了
		timer = setInterval(function () {
			if (document && document.getElementById && document.getElementsByTagName && document.body) {
				doReady();
			}
		}, 1);
	} else if (document.addEventListener) {//W3C
		addEvent(document, 'DOMContentLoaded', function () {
			fn();
			removeEvent(document, 'DOMContentLoaded', arguments.callee);
		});
	} else if (sys.ie && sys.ie < 9){
		var timer = null;
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				doReady();
			} catch (e) {};
		}, 1);
	}
}

//跨浏览器获取视口大小
function getInner() {
	if (typeof window.innerWidth != 'undefined') {
		return {
			width : window.innerWidth,
			height : window.innerHeight
		};
	} else if(typeof window.innerWidth == 'undefined'&&document.compatMode=="CSS1Compat"){
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		};
	}else if(typeof window.innerWidth == 'undefined'&&document.compatMode!="CSS1Compat"){
		return {
			width : document.body.clientWidth,
			height : document.body.clientHeight
		};
	}
}

//获取滚动距离
function getScroll(){
	return {
		top:document.documentElement.scrollTop||document.body.scrollTop,
		left:document.documentElement.scrollLeft||document.body.scrollLeft
	};
}
//跨浏览器获取Style
function getStyle(element, attr) {
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		return window.getComputedStyle(element, null)[attr];
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		return element.currentStyle[attr];
	}
}

//删除前后空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//跨浏览器获取text
function getText(ele){
	return (typeof ele.textContent=="string")? ele.textContent : ele.innerText;
}

//跨浏览器设置text
function setText(ele,value){
	if(typeof ele.textContent=="string"){
		ele.textContent=value;
	}else{
		ele.innerText=value;
	}
}

//判断一个项是否在一个数组内
function inArray(one,arr){
	for(var i=0;i<arr.length;i++){
		if(arr[i]===one){
			return true;
		}
	}
	return false;
}

function offsetTop(ele){
	var top=ele.offsetTop;
	var parent=ele.offsetParent;
	while(parent){
		top+=parent.offsetTop;
		parent=parent.offsetParent;
	}
	return top;
}

//创建XHR对象
function createXHR(){
	if(typeof XMLHttpRequest!="undefined"){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject!="undefined"){
		var version = [
			'MSXML2.XMLHttp.6.0',
			'MSXML2.XMLHttp.3.0',
			'MSXML2.XMLHttp'
			];
		for (var i = 0; version.length; i ++) {
			try {
				return new ActiveXObject(version[i]);
			} catch (e) {
				//跳过
			}	
		}
		 
	}else {
			throw new Error('您的系统或浏览器不支持XHR对象！');
		}
}

//兼容IE6
function ajax(obj){
	//创建XHR对象
	var xhr=(function (){
	if(typeof XMLHttpRequest!="undefined"){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject!="undefined"){//ie6及以下的创建方法
		var version = [
			'MSXML2.XMLHttp.6.0',
			'MSXML2.XMLHttp.3.0',
			'MSXML2.XMLHttp'
			];
		for (var i = 0; version.length; i ++) {
			try {
				return new ActiveXObject(version[i]);
			} catch (e) {
				//跳过
			}	
		}	 
	}else {
			throw new Error('您的系统或浏览器不支持XHR对象！');
		}
    })();
    //处理IE缓存问题
    obj.url+="?rand="+Math.random();
    //将传入的数据编码并拼结成字符串
    obj.data=(function(data){
    	var arr=[];
    	for(var i in data){
    		arr.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
    	}
    	return arr.join("&");
    })(obj.data);
    if(obj.method=="get"){
    	obj.url+=obj.url.indexOf("?")==-1? "?"+obj.data:"&"+obj.data;
    }
    //异步处理方法
    if(obj.async===true){
    	xhr.onreadystatechange=function(){
    		if(xhr.readystate==4){
    			if(status==200){
    				obj.success(xhr.responseText);
    			}else{
    				alert(xhr.statusText+xhr.status);
    			}
    		}
    	};
    }
    xhr.open(obj.method,obj.url,obj.async);
    if(obj.method=="post"){
    	//设置请求头
    	xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
    	shr.send(obj.data);
    }else if(obj.method=="get"){
    	shr.send(null);
    }
    //同步处理方法
    if(obj.async===false){
    	if(status==200){
    		obj.success(xhr.responseText);
    	}else{
    		alert(xhr.statusText+xhr.status);
    	}
    }
}

//不兼容IE6
function ajax(obj){
	//创建XHR对象
	var xhr=new XMLHttpRequest();  
    //处理IE缓存问题
    obj.url+="?rand="+Math.random();
    //将传入的数据编码并拼结成字符串
    obj.data=(function(data){
    	var arr=[];
    	for(var i in data){
    		arr.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
    	}
    	return arr.join("&");
    })(obj.data);
    if(obj.method=="get"){
    	obj.url+=obj.url.indexOf("?")==-1? "?"+obj.data:"&"+obj.data;
    }
    //异步处理方法
    if(obj.async===true){
    	xhr.onreadystatechange=function(){
    		if(xhr.readystate==4){
    			if(status==200){
    				obj.success(xhr.responseText);
    			}else{
    				alert(xhr.statusText+xhr.status);
    			}
    		}
    	};
    }
    xhr.open(obj.method,obj.url,obj.async);
    if(obj.method=="post"){
    	//设置请求头
    	xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
    	shr.send(obj.data);
    }else if(obj.method=="get"){
    	shr.send(null);
    }
    //同步处理方法
    if(obj.async===false){
    	if(status==200){
    		obj.success(xhr.responseText);
    	}else{
    		alert(xhr.statusText+xhr.status);
    	}
    }
}