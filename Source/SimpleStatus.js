(function(){

var SimpleStatus = this.SimpleStatus = new Class({

	Implements: [Events, Options, Class.Binds],

	options: {
		'class': 'ss-container',
		duration: 3000,
		position: 'top',
		fxOptions: {
			duration: 500,
			fps: 1000
		}
	},

	initialize: function(options){
		this.setOptions(options);

		this.container = new Element('div', {
			'class': this.options['class'],
			styles: {
				position: 'fixed',
				display: 'none'
			}
		}).inject(document.body);

		this.fx = new Fx.Tween(this.container, this.options.fxOptions);

		this.message = new Element('span').inject(this.container);
	},

	// Add message to queue if already showing
	showMessage: function(message){
		this._queue.push(message);
		if (this._shown) return this;
		this._showMessage();
		return this;
	},

	// Force message to hide, and clear queue
	hideMessage: function(){
		clearTimeout(this._timer);
		this._queue = [];
		this._hideMessage();
	},

	_queue: [],
	_shown: false,
	_timer: null,
	_info: {},

	_setMessage: function(message){
		if (!message) return;
		this.message.set('text', message);
		return this;
	},

	_showMessage: function(){
		if (!this._queue.length) return this._hideMessage();
		var message = this._queue.shift();
		this._setMessage(message);
		this.fireEvent('showMessage', message);
		if (this._shown) return this._cycleMessages();
		this._shown = true;
		this._info = this.container.measure(function(){ return this.getSize(); });
		this.container
			.setStyle(this.options.position, -(this._info.y))
			.setStyle('display', 'block');
		this.fx
			.addEvent('complete:once', this.bound('_showComplete'))
			.start(this.options.position, 0);
	},

	_showComplete: function(){
		this._cycleMessages();
	},

	_hideMessage: function(){
		this.fireEvent('hideMessage');
		this._info = this.container.measure(function(){ return this.getSize(); });
		this.fx
			.addEvent('complete:once', this.bound('_hideComplete'))
			.start(this.options.position, -(this._info.y));
	},

	_hideComplete: function(){
		this._shown = false;
		if (this._queue.length) return this._showMessage();
	},

	_cycleMessages: function(){
		clearTimeout(this._timer);
		this._timer = this._showMessage.delay(this.options.duration, this);
	}
});

}).call(this);
