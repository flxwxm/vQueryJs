//拖拽。
$().extend("drag",function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onmousedown=function(ev){
			ev=ev||window.event;
			
			var _this=this,
			   posX=ev.clientX-this.offsetLeft,
			   posY=ev.clientY-this.offsetTop;
			 if ( this.setCapture ) {
				this.setCapture();
			}//阻止非标准IE默认行为

			document.onmousemove=function(ev){
				ev=ev||window.event;
				var iTop=ev.clientY-posY,
					iLeft=ev.clientX-posX;
				if(iTop>getScroll().top+getInner().height-_this.offsetHeight){
					iTop=getScroll().top+getInner().height-_this.offsetHeight;
				}else if(iTop<getScroll().top){
					iTop=getScroll().top;
				}
				if(iLeft<getScroll().left){
					iLeft=getScroll().left;
				}
				else if(iLeft>getScroll().left+getInner().width-_this.offsetWidth){
					iLeft=getScroll().left+getInner().width-_this.offsetWidth;
				}	
				_this.style.top=iTop+"px";
				_this.style.left=iLeft+"px";

			};
			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
				if ( _this.releaseCapture ) {
					_this.releaseCapture();
				}
			};
			return false;//阻止其它浏览器默认行为
		};
	}
	return this;
});