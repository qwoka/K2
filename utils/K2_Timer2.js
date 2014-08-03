

//_________________________________________
K2HiResTimer = function(o){

	this.makeTimerShim_();
	this.resetObject(o);

};
K2HiResTimer.prototype = {constructor: K2HiResTimer,

//_________________________________________
	resetObject: function(o){

		this.num_frames = 0;
		this.time_elapsed = 0;
		this.system_seconds = 0;
		this.start_time = 0;
		this.end_time = 0;
		this.delta_time = 0;
		this.last_time = 0;
		this.paused_time = 0;
		this.offset = 0;
		this.isRunning = false;
		
		this.paused_state = 0;
		
		this.callback = o.callback;
		
		this.fixedTimers = [];
		
		for (var i=0; i<o.timers.length; ++i){
			this.makeFixedTimer(o.timers[i]);
		}
	},
//_________________________________________
	makeFixedTimer: function(o){

		var t = new K2HiResTimerFixed(o);
		this.fixedTimers.push(t);
		t.timer = this;
		return t;
	},
//_________________________________________
	getSystemSeconds: function(){
		
		return Date.now() * 0.001;
	},
//_________________________________________
	setSeconds: function(seconds_in){
		
		this.offset -= (this.system_seconds - this.start_time - this.paused_time + this.offset) - seconds_in;
	},
//_________________________________________
	getTotalSeconds: function(){
		
		return this.system_seconds - this.start_time;
	},
//_________________________________________
	pause: function(pause_in){
		
		this.paused_state = pause_in;
	},
//_________________________________________
	isPaused: function(){
		
		return this.paused_state;
	},
//_________________________________________
	start: function(){
		
		this.isRunning = true;
		this.tick();
	},
//_________________________________________
	stop: function(){
		
		this.isRunning = false;
	},
//_________________________________________
	makeTimerShim_: function(){
		
		// Provides cancelAnimationFrame in a cross browser way.
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var i=0; i<vendors.length && !window.requestAnimationFrame; ++i) {
			window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
		}
	 
	 	// fallback to setTimeout
		if (!window.requestAnimationFrame){
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		
	 	// fallback to setTimeout
		if (!window.cancelAnimationFrame){
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};		
		}
	},
//_________________________________________
	requestFrame_: function(){
		
		var self = this;
		window.requestAnimationFrame(function(){
			self.tick();
		});
	},
//_________________________________________
	tick: function(){

		if (!this.isRunning) return;
		
		// reqest next frame
		this.requestFrame_();
			
		++this.num_frames;
		this.last_time = this.system_seconds;
		this.system_seconds = this.getSystemSeconds();
		this.delta_time = this.system_seconds - this.last_time;
		
		if (this.paused_state) this.paused_time += this.system_seconds - this.last_update;

		this.time_elapsed = this.system_seconds - this.start_time - this.paused_time + this.offset;
		
		// advance fixed timers
		var t;
		for (var i=this.fixedTimers.length-1; i>=0; --i){
			t = this.fixedTimers[i];
			t.tick(this);
		}
		
		// do call back
		//if ((this.callback!=null) && (!this.paused_state))
		if (this.callback!=null)
			this.callback(this);
	},
};



//_________________________________________
K2HiResTimerFixed = function (o) {

	this.resetObject(o);

};K2HiResTimerFixed.prototype = {constructor: K2HiResTimerFixed,

//_________________________________________
	resetObject: function (o) {

		this.num_steps = 0;
		this.step_delta = o.delta;
		this.frame_u = 0.0;
		this.step_elapsed = 0.0;
		this.callback = o.callback;
		this.timer = null;
	},
//_________________________________________
	log: function (s) {

		console.log(s);
	},
//_________________________________________
	tick: function (t) {

		// advance step
		this.step_elapsed += t.delta_time;
		
		// are we ready 
		if (this.step_elapsed>=this.step_delta){
			
			// step
			++this.num_steps;
			this.step_elapsed -= this.step_delta;
			
			// if delta was greater than our step time, reset ratio
			if (this.step_elapsed>this.step_delta){
//				this.log('step exceeded: ['+this.num_steps+'] '+this.step_elapsed);
				this.step_elapsed = 0.0;
			}
			
			// do call back
			//if (this.callback!=null)
			if (!t.paused_state)
				this.callback(this);
		}
		
		// compute current ratio between frames
		this.frame_u = this.step_elapsed / this.step_delta;
	},
};



