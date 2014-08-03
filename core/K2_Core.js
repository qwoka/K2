/*
k2 Engine
a simple, scalable, Javascript, XML driven, WebGL 3D Engine
*/


// 	Globals
//_________________________________________
	k2WORLDPATH = "./k2world/";
	
	k2Modules = {};
	k2Factories = {};
	k2ObjectPool = {};
	
//_________________________________________
	function k2RegisterModule(name, fn){
		
		k2Modules[name] = fn;
		var newFactories = fn();
		jQuery.extend(k2Factories, newFactories);
	}
//_________________________________________
	function k2MakeObject(classname){
		
		// get from pool ?
		if (k2ObjectPool.hasOwnProperty(classname) &&
			k2ObjectPool[classname] != null &&
			k2ObjectPool[classname].length > 0){
			return k2ObjectPool[classname].pop();
		}
		
		// do we have a factory ?
		if (!k2Factories.hasOwnProperty(classname)) {
			return null;
		}
		
		// make the object
		var f = k2Factories[classname];
		var o = new f();
		//o.className_ = classname;
		o.factory_ = f;
		return o;
	}
//_________________________________________
	function k2ReleaseObject(o){
		
		if (!k2ObjectPool.hasOwnProperty(classname) ||
			k2ObjectPool[classname] != null){
			k2ObjectPool[classname] = [];	
		}
		k2ObjectPool[classname].push(o);
	}
////_________________________________________
//	function k2Log(o){
//		
//		if (window.console && console.log){
//			window.console.log(o);
//		} else {
//			alert(o.toString());
//		}
//	}
//_________________________________________
	function k2GetObjectClass(obj) {
		
		if (obj && obj.constructor && obj.constructor.toString) {
			var s = obj.constructor.toString();
			var arr = s.match(/function\s*(\w+)/);
			if (arr && arr.length == 2) return arr[1];
		}
		return undefined;
	}






