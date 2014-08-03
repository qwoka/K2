    /* Simple View Controller */

    /*
        callback_obj =
        {    
            mouseMove: function(mvc,mPos,mDelta,keyState) {},
            mouseDown: function(mvc,mPos,keyState) {},
            mouseUp: function(mvc,mPos,keyState) {},
            bool keyDown: function(mvc,mPos,key,keyState) {}, // return false to cancel keyDown event / keyState
            keyUp: function(mvc,mPos,key,keyState) {},
            bool keyPress: function(mvc,mPos,key,keyState) {},  // return false to cancel keyDown event / keyState
            wheelMove: function(mvc,mPos,wDelta,keyState) {}
        }
    */


//_________________________________________
    function K2UserInput() {
		
		this.resetObject();		
    }

    K2UserInput.prototype = {
		
//_________________________________________
	resetObject: function() {
		
        this.canvas = null;
				
		this.mouseX = 0.0;
		this.mouseY = 0.0;
		this.mouseLastX = 0.0;
		this.mouseLastY = 0.0;
		
		this.mouseDown = false;
		this.mouseOnCanvas = false;
		
		this.mouseWheel = 0;
		
		// reset buttons
//      for (var i in k2KEYBOARD) k2KEYSTATE[i] = false;          
//		for (i=k2KEYBOARD.JOYBUTTON_MAX; i>=k2KEYBOARD.JOYBUTTON; --i) k2KEYSTATE[i] = false; 
	},
//_________________________________________
	start: function (c) {
		
		var self = this;
        self.canvas = c;
		var doc = jQuery(document);
		
		// set events
		doc.mousemove(function(e){
			self.onMouseMove_(e);
		});
		c.mousedown(function(e){
			self.onMouseDown_(e);
		});
		c.mouseleave(function(e){
			self.onMouseLeave_(e);
		});
		doc.mouseup(function(e){
			self.onMouseUp_(e);
		});
		doc.keydown(function(e){
			self.onKeyDown_(e);
		});
		doc.keyup(function(e){
			self.onKeyUp_(e);
		});
		
		// wheel
		c.mousewheel(function(e, delta){
			self.onMouseWheel_(e, delta);
		});
		
		// preve
		this.set4WayCursor(c);
		
		// set
	},
//_________________________________________
	stop: function () {
		
		var doc = jQuery(document);
		var c = this.canvas;
		
		c.unbind('mousewheel');
		doc.unbind('mousemove');
		c.unbind('mousedown');
		c.unbind('mouseleave');
		doc.unbind('mouseup');
		doc.unbind('keydown');
		doc.unbind('keyup');
	},
//_________________________________________
	set4WayCursor: function(c){
		
		// prevent selection
		c.on('selectstart', false);
		c.attr('unselectable', 'on');
		c.css({
			'-moz-user-select':'none',
			'-o-user-select':'none',
			'-khtml-user-select':'none',
			'-webkit-user-select':'none',
			'-ms-user-select':'none',
			'user-select':'none'
		});
		 
		 // set 4 way cursor
		 c.css({
			 'cursor': 'url("/_js/lib/jquery/neo/controls/k2/images/4_way_arrow.png"), default'
		 });
	},
//_________________________________________
	updateDragDelta: function(){
		
		//this.mouseWheel = 0;
		
		// record how much mouse has moved
		if (!this.mouseDown){
			this.mouseLastX = this.mouseX;
			this.mouseLastY = this.mouseY;
		}
	},
//_________________________________________
	isDown: function(k){
		
		// are we listeneing for it?
		if (k2KEYSTATE.hasOwnProperty(k))
			return k2KEYSTATE[k];  
	
		// enable for next time
		k2KEYSTATE[k] = false;			
		return false;
	},
//_________________________________________
	getMouseDragX: function(){
		
		return this.mouseX - this.mouseLastX;
	},
//_________________________________________
	getMouseDragY: function(){
		
		return this.mouseY - this.mouseLastY;
	},
//_________________________________________
	preventDefault_: function (e) {
		
		e.returnValue = false;  
		e.preventDefault();
		return false;
	},
//_________________________________________
	onMouseWheel_: function (e, delta) {
		
		if (!this.mouseOnCanvas) return true;
		this.mouseWheel += delta;
		return this.preventDefault_(e);
	},
//_________________________________________
	onMouseLeave_: function (e) {
		
		this.mouseOnCanvas = false;
	},
//_________________________________________
	onMouseUp_: function (e) {
		
		if (!this.mouseOnCanvas) return true;
		
		this.mouseDown = false;
		if (k2KEYSTATE.hasOwnProperty(k2KEYBOARD.MOUSE))
			k2KEYSTATE[k2KEYBOARD.MOUSE] = false;  
		
		return true;
		//return this.preventDefault_(e);
	},
//_________________________________________
	onMouseDown_: function (e) {
		
		//console.log('mousedown');		
		if (!this.mouseOnCanvas) return true;
		
		this.mouseDown = true;
		if (k2KEYSTATE.hasOwnProperty(k2KEYBOARD.MOUSE))
			k2KEYSTATE[k2KEYBOARD.MOUSE] = true;  
			         
		return true;
		//return this.preventDefault_(e);
	},
//_________________________________________
	onKeyDown_: function (e) {
		
		if (!this.mouseOnCanvas) return true;
		
		k2KEYSTATE[e.keyCode] = true; 
		          
		return this.preventDefault_(e);
	},
//_________________________________________
	onKeyUp_: function (e) {
		
		//if (!this.mouseOnCanvas) return true;
		
		k2KEYSTATE[e.keyCode] = false; 
		            
		return this.preventDefault_(e);
	},
 //_________________________________________
	onMouseMove_: function (e) {
		
		var p = this.canvas.position();
		this.computePosition_(e, p.left, p.top, this.canvas.width(), this.canvas.height());
		this.mouseOnCanvas = true; //this.isMouseInCanvas_();
	},
//_________________________________________
	computePosition_: function (e, x, y, w, h) {
		
		this.mouseX = (e.pageX - x) / w;
		this.mouseY = (e.pageY - y) / h;
	},
////_________________________________________
//	isMouseInCanvas_: function(k){
//		
//		if (this.mouseX<0.0) 
//			return false;
//		if (this.mouseY<0.0)
//			return false;
//		if (this.mouseX>1.0)
//			return false;
//		if (this.mouseY>1.0)
//			return false;
//		return true;  
//	},
};



//_________________________________________
function K2KeyBoardKey(k) {
	
	this.resetObject(k);
};

K2KeyBoardKey.prototype = {
//_________________________________________
	resetObject: function(k) {
		
		this.key = k;
		this.keyStillDown = true;
		k2KEYSTATE[k] = false;
	},
//_________________________________________
	isDown: function(){
		
		return k2KEYSTATE[this.key];  
	},
//_________________________________________
	isPressed: function(){
		
		if (this.isDown()){
			if (this.keyStillDown) 
				return false;
			this.keyStillDown = true;
			return true;
		}
		this.keyStillDown = false;
		return false;
	},
};


k2KEYBOARD = {
	MOUSE: 0,
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE: 19,
	CAPS_LOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	INSERT: 45,
	DELETE: 46,
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	LEFT_META: 91,
	RIGHT_META: 92,
	SELECT: 93,
	NUMPAD_0: 96,
	NUMPAD_1: 97,
	NUMPAD_2: 98,
	NUMPAD_3: 99,
	NUMPAD_4: 100,
	NUMPAD_5: 101,
	NUMPAD_6: 102,
	NUMPAD_7: 103,
	NUMPAD_8: 104,
	NUMPAD_9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	DECIMAL: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUM_LOCK: 144,
	SCROLL_LOCK: 145,
	SEMICOLON: 186,
	EQUALS: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FORWARD_SLASH: 191,
	GRAVE_ACCENT: 192,
	OPEN_BRACKET: 219,
	BACK_SLASH: 220,
	CLOSE_BRACKET: 221,
	SINGLE_QUOTE: 222,
	
	JOYBUTTON: 256,			// uses a block of buttons
	JOYBUTTON_MAX: 271
};

k2KEYSTATE = {};
