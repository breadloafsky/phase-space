const re = new RegExp(/([A-z])\w+|E|([()])|([\+\-\/\*\%])|([\d.]+)|(x|y|z|v)(?![A-z])/gm);

const colors = ["#73d4ea","#dbd46e","white","#dfe4be"];

const varColors ={
	x:"#fb9191", 
	y:"#96e6b3",
	z:"#9adeff",
	v:"#dcb1ff"
}

export const utils = {

	// syntax highlighter
	highlight: (str:string) => {
		let lastIdx = 0;
		let result = [];
		let l = null;
		while (true) 
		{
			l = re.exec(str);
			if(!l)
			{
				result.push({
					str:str.slice(lastIdx,str.length),
					color:"white"
				});
				break;
			}
			if(l.index > lastIdx)
			{
				result.push({
					str:str.slice(lastIdx,l.index),
					color:"white"
				});
			};
			let idx = 0;
			for(let i = 1; i < l.length; i++)
			{
				if(l[i])
					idx=i-1;
			}
			result.push(
				{
					str:l[0],
					style: `${
						 idx == 4 ? "color:" + varColors[l[0] as"x"|"y"|"z"|"v"]+";font-style:italic;" :
						 "color:"+colors[idx]}`
				}
			);
			lastIdx = l.index+l[0].length;
		};

		return result;
	},

	// parser
	parse: (str:string)=>{
		str = str.replace(/([A-z])\w+|E/g, 'Math.$&');
		//alert(str);
		return str;
	}
}