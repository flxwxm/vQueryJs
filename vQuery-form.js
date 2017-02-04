$().extend("serilaize",function(){
	for(var i=0;i<this.elements.length;i++){
		var result={};
		var fileds=this.elements[i].elements;
		var len=fileds.length;
		for(var j=0;j<len;j++){
			var filed=fileds[j];
			switch(filed.type){
				case "reset":
				case "submit":
				case "button":
				case "file":
				case undefined:
					break;
				case "radio":
				case "chekbox":
					if(!filed.selected){break;}
				case "select-one":
				case "select-multiple":
					for(var k=0;k<filed.options.length;k++){
						var value="";
						var option=filed.options[k];
						if(option.selected){
							if(option.hasAttribute){
								value=option.hasAttribute("value")?option.value:option.text;
							}else{
								value=(option.attributes("value").specified ? option.value : option.text);
							}
							result[filed.name]=value;
						}
						
					}
					break;
				default:
					 result[filed.name]=filed.value;	
			}
		}
		return result;
	}
	return this;
});