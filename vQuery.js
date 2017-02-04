var $=function(args){
	return new Base(args);
};

function Base(args){
	this.elements=[];
	if(typeof args=="object"&&args!=undefined){
		this.elements[0]=args;
	}else if(typeof args=="string"){
		if(args.indexOf(" ")!=-1){
			var eles=args.split(" "),
				temporary=[],
				parentNode=[];
			for(var i=0;i<eles.length;i++){
				if(parentNode.length==0){parentNode.push(document);}
				switch(eles[i].charAt(0)){
					case "#":
						temporary=[];
						temporary.push(this.getId(eles[i].substring(1)));
						parentNode=temporary;
						break;
					case ".":
						temporary=[];
						for(var j=0;j<parentNode.length;j++){
							var temps=this.getClass(eles[i].substring(1),parentNode[j]);
							for(var k=0;k<temps.length;k++){
								temporary.push(temps[k]);
							}
						}
						parentNode=temporary;
						break;
					default:
						temporary=[];
						for(var j=0;j<parentNode.length;j++){
							var temps=this.getTag(eles[i],parentNode[j]);
							for(var k=0;k<temps.length;k++){
								temporary.push(temps[k]);
							}
						}
						parentNode=temporary;
				}
			}
			this.elements=temporary;
		}else{
			switch(args.charAt(0)){
				case "#":
					this.elements.push(this.getId(args.substring(1)));
					break;
				case ".":
					this.elements=this.getClass(args.substring(1));
					break;
				default:
					this.elements=this.getTag(args);
			}
		}
		
	}else if(typeof args=="function"){
		this.ready(args);
	}
}

Base.prototype.ready=function(fn){
	whenReady(fn);
};
//获取元素
Base.prototype.find=function(args){
	var temporary=[];
	for(var i=0;i<this.elements.length;i++){
		switch(args.charAt(0)){
			case "#":
				temporary.push(this.getId(args.substring(1)));
				break;
			case ".":
				var temps=this.getClass(args.substring(1),this.elements[i]);
				for(var j=0;j<temps.length;j++){
					temporary.push(temps[j]);
				}
				break;
			default:
				var temps=this.getTag(args,this.elements[i]);
				for(var j=0;j<temps.length;j++){
					temporary.push(temps[j]);
				}
		}
	}
	this.elements=temporary;
	return this;
};
Base.prototype.getId=function(id){
	return document.getElementById(id);
};
Base.prototype.getTag=function(tag,parent){
	var temporary=[],
		node=null;

	if(parent){
		node=parent;
	}else{
		node=document;
	}
	var tags=node.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
		temporary.push(tags[i]);
	}
	return temporary;
};
Base.prototype.getClass=function(classname,parent){
	var eles=null,
		temporary=[],
		reg=new RegExp("\\b"+classname+"\\b","i"),
		node=null;
		 if(!parent){
		 	node=document;
		 }else{
		 	node=parent;
		 }
		 eles=node.getElementsByTagName("*");
	 	for(var i=0;i<eles.length;i++){
	 		if(reg.test(eles[i].className)){
	 			temporary.push(eles[i]);
	 		}
	 	}
	
	return temporary;
};

//获取某个节点
Base.prototype.eq=function(num){
	var ele=this.elements[num];
	this.elements=[];
	this.elements.push(ele);
	return this;
};

//获取某个节点
Base.prototype.ge=function(num){
	return this.elements[num];
};

//获取下一个兄弟节点
Base.prototype.next=function(){
	
	for(var i=0;i<this.elements.length;i++){
		this.elements[i] = this.elements[i].nextSibling;
		if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
		if (this.elements[i].nodeType == 3){//ie的下一个节点可能是文本节点。
			this.next();
		} 
	}
	return this;
};

//获取上一个兄弟节点
Base.prototype.prev=function(){
	
	for(var i=0;i<this.elements.length;i++){
		this.elements[i] = this.elements[i].previousSibling;
		if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
		if (this.elements[i].nodeType == 3){//ie的下一个节点可能是文本节点。
			this.prev();
		} 
	}
	return this;
};

//获取第一个元素
Base.prototype.first=function(){	
	var ele=this.elements[0];
	this.elements=[];
	this.elements.push(ele);
	return this;
};

//获取第一个元素,并返回这个元素。
Base.prototype.fi=function(){	
	return this.elements[0];
};

//获取最后一个元素
Base.prototype.last=function(){	
	var ele=this.elements[this.elements.length-1];
	this.elements=[];
	this.elements.push(ele);
	return this;
};

//获取最后一个元素,并返回这个元素。
Base.prototype.la=function(){	
	return this.elements[this.elements.length-1];
};
//添加class
Base.prototype.addClass=function(classname){

	var reg=new RegExp("\\b"+classname+"\\b","g");
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className==""){
			this.elements[i].className=classname;
		}else{
			if(reg.test(this.elements[i].className)==false){
				this.elements[i].className+=" "+classname;
			}
		}
	}
	return this;
};

//删除class
Base.prototype.removeClass=function(classname){
	var reg=new RegExp("\\b"+classname+"\\b","g");
	for(var i=0;i<this.elements.length;i++){
	
			if(reg.test(this.elements[i].className)){
				this.elements[i].className=this.elements[i].className.replace(reg," ");
			}
		
	}
	return this;
};

//设置css
Base.prototype.css=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
			if(arguments.length==1){
				if(typeof window.getComputedStyle!="undefined"){
					return window.getComputedStyle(this.elements[i])[attr];
				}
				else if(typeof this.elements[i].currentStyle!="undefined"){
					return this.elements[i].currentStyle[attr];
				}
			}else{
				this.elements[i].style[attr]=value;
			}
		}
	return this;
};

//设置innerHTML
Base.prototype.html=function(value){
	for(var i=0;i<this.elements.length;i++){
			if(arguments.length==0){
				return this.elements[i].innerHTML;
			}
			this.elements[i].innerHTML=value;		
		}
	return this;
};

//设置text
Base.prototype.text=function(value){
	for(var i=0;i<this.elements.length;i++){
			if(arguments.length==0){
				return getText(this.elements[i]);
			}
			setText(this.elements[i],value);
		}
	return this;
};

//设置value
Base.prototype.value=function(str){
	for(var i=0;i<this.elements.length;i++){
			if(arguments.length==0){
				return this.elements[i].value;
			}
			this.elements[i].value=str;
		}
	return this;
};

//设置透明度
Base.prototype.opacity=function(num){
	for(var i=0;i<this.elements.length;i++){
			this.elements[i].style.opacity=num/100;
			this.elements[i].style.filter="alpha(opacity="+num+")";
		}
	return this;
};

//获取节点元素集合的长度
Base.prototype.length=function(){
	return this.elements.length;
};

//获取一个节点的某个属性值
Base.prototype.attr=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
			if(arguments.length==1){
				return this.elements[i].getAttribute(attr);
			}
			this.elements[i].setAttribute(attr,value);
		}
	return this;
};

//获取某一个节点在整个节点组中是第几个索引
Base.prototype.index=function(){
	var childElements=this.elements[0].parentNode.children;
	for(var i=0;i<childElements.length;i++){
		if(this.elements[0] == childElements[i]){return i;}
}
	
};
//绑定事件
Base.prototype.on=function(type,fn){
	for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],type,fn);
		}
	return this;
};

//click
Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
			this.elements[i].onclick=fn;
		}
	return this;
};

//hover
Base.prototype.hover=function(fn1,fn2){
	for(var i=0;i<this.elements.length;i++){
			this.elements[i].onmouseover=fn1;
			this.elements[i].onmouseout=fn2;
		}
	return this;
};

//resize
Base.prototype.resize=function(fn){
	window.onresize=fn;
	return this;
};

//显示
Base.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
			this.elements[i].style.display="block";
		}
	return this;
};
//隐藏
Base.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
			this.elements[i].style.display="none";
		}
	return this;
};
//物体居中
Base.prototype.center=function(){
	for(var i=0;i<this.elements.length;i++){
		var left=(getInner().width-this.elements[i].offsetWidth)/2+getScroll().left;
		var top=(getInner().height-this.elements[i].offsetHeight)/2+getScroll().top;	
		this.elements[i].style.left=left+"px";
		this.elements[i].style.top=top+"px";
	}
	return this;
};

//点击切换
Base.prototype.toggle=function(){
	for(var i=0;i<this.elements.length;i++){
		(function(element,args){
			var num=0;
			addEvent(element,"click",function(){
			args[num++%args.length].call(this);
		});
		})(this.elements[i],arguments);		
	}
	return this;
};

//运动
Base.prototype.animat=function(obj){

	for(var i=0;i<this.elements.length;i++){

		var ele=this.elements[i],
			time=obj["time"]? obj["time"]:50,
			attr=obj["attr"],
			speed=obj["speed"]? obj["speed"]:8,
			v=obj["v"]? obj["v"]:7,//V是缓冲运动中计算速度的除数。
			target=obj["target"],
			alter=obj["alter"],
			type=obj["type"]==0?"constant":obj["type"]==1?"buffer":"buffer",
			iSpeed=0,
			fn=obj["fn"]?obj["fn"]:0,
			mul=obj["mul"];

		//	alter和target只能有一个。
		if(alter!=undefined && target==undefined){
			target=alter+getStyle(ele,attr);	
		}else if (alter==undefined && target==undefined && mul == undefined) {
			throw new Error('增量或target目标量必须传一个！');
		}

		if(attr=="opacity"){
			speed=target>getStyle(ele,attr)*100? speed:-speed;
		}else{
			speed=target>getStyle(ele,attr)? speed:-speed;
		}
		
		if(mul == undefined){
			mul={};
			mul[attr]=target;
		}

		clearInterval(ele.move);

		ele.move=setInterval(function(){
			var test=true;
			for(var a in mul){

				attr=a;
				target=mul[a];
				var iNowStyle;

				if(type=="buffer"){
					speed=(attr=="opacity")?(target-parseInt(getStyle(ele,attr)*100))/v :(target-getStyle(ele,attr))/v;
					speed=speed>0? Math.ceil(speed) : Math.floor(speed);
				}

				if(attr=="opacity"){
					iNowStyle=parseInt(getStyle(ele,attr)*100)+speed;
				}else{
					iNowStyle=parseInt(getStyle(ele,attr))+speed;
				}

				if((iNowStyle>target&&speed>0)||(iNowStyle<target&&speed<0)){
					iNowStyle=parseInt(target);
				}
				if(attr=="opacity"){
					ele.style[attr]=iNowStyle/100;
					ele.style.filter="alpha(opacity="+iNowStyle+")";
				}else{
					ele.style[attr]=iNowStyle+"px";
				}
		
				if(iNowStyle!=parseInt(target)){
					test=false;
				}

			if(test){
					clearInterval(ele.move);
					if(fn)fn();
			}
			
			}
		},time);
	
	}
	return this;
};

//插件入口
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
};
