import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service} from '@ember/service';

export default Component.extend({
	socketIOService: service('socket-io'),
	realmodel: [],
	realmod: ["Lamp", "Lamp2", "Frontdoor", "Foyerlamp"],
	commands: ["on", "off", "dim50%"],
	
	info: '',
	autodevice: '',
	commandtosend: '',
	starttime: '',
	tasks: [],
	firstdevice: '',
	seconddevice: '',
	thirddevice: '',
	action1: '',
	action2: '',
	action3: '',
	time1: '',
	time2: '',
	time3: '',
	info1: '',
	info2: '',
	info3: '',
	
	
	didInsertElement() {
		this._super(...arguments);
		const socket = this.get('socketIOService').socketFor('ws://194.95.194.122:8086/');
		this.set('socket', socket);
		self = this;
		
		socket.emit('command', 'jsonlist2', function (data) {
					var rawrealmodel = [];
					var stringdata = data.join("");
					var re = /Bye.../gi;
					var purestr = stringdata.replace(re, " ");
					var jsobj = JSON.parse(purestr); // Down there used to be only "schedule" filter!
					for (var i=0; i < jsobj.Results.length; i++){
							if(!/((schedule)|(new)|(fs20log)|(temp)|(telnet)|(WEB)|(autocreate)|(global)|(Logfile)|(initialUsb)|(eventTypes)|(CUL)|(FileLog)|(HM_)|(Action)|(energy))/.test(jsobj.Results[i].Name)){
								rawrealmodel.push(jsobj.Results[i]);
							}
						}
					self.set('realmodel', rawrealmodel);
					//self.set('tasks', rawrealmodel);
            });
		
	},
	
	
	
	actions: {
		
		startit: function(event){
			this.set('starttime', event.target.value);
		},
		
		chooseDevice(dev) {
			this.set('autodevice', dev);
		},
		
		choosecommand(commands) {
			this.set('commandtosend', commands);
		},
		
		sendcommand: function(data, comm){
		const socket = this.get('socketIOService').socketFor('ws://194.95.194.122:8086/');
		var partcommand = '';
		
		var time = this.get('starttime');
		
	
		var complexorbasic = '';
		var atornotifyorempty = '';
		var finaltasks = '';
		
		var ifpart = " IF ([" + data + "] eq " + '"' + comm + '") '; // Complete!
		
		if (time) {
			atornotifyorempty = " at " + time;
		} else if (!time) {
			atornotifyorempty = " notify " + comm;
		}
		
		if (this.get('tasks').length) {
			complexorbasic = "complex";
			finaltasks = "( " + this.get('tasks') + " )";
		} else if (!this.get('tasks').length) {
			complexorbasic = "basic";
			ifpart = '';
			finaltasks = ' set ' + data + " " + comm;
		}
		
		if (!this.get('tasks').length && !time) {
			partcommand = finaltasks;
		} else {
			partcommand = "define " + complexorbasic + data + atornotifyorempty + ifpart + finaltasks;
		}
		
		console.log(partcommand);
		socket.emit("command", partcommand);
		
		},
		
		cancelit: function(data){
			this.get('socket').emit("command", "delete " + data);
			window.alert("Cancelled ");
		},
		
		chooseDevice1(dev) {
			this.set('firstdevice', dev);
		},
		
		chooseDevice2(dev) {
			this.set('seconddevice', dev);
		},
		
		chooseDevice3(dev) {
			this.set('thirddevice', dev);
		},
		
		action1(commands) {
			this.set('action1', commands);
		},
		
		action2(commands) {
			this.set('action2', commands);
		},
		
		action3(commands) {
			this.set('action3', commands);
		},
		
		save1(data, action) {
			if (!data || !action) {
				this.set('info1', " Please complete device and action ");
			} else if (data && action) {
				var object = " set " + data + " " + action;
				this.get('tasks').push(object);
				this.set('info1', " Saved ");
			}
			
			console.log(data + " and " + action + " and " + this.get('time1'));
		},
		
		save2(data, action) {
			if (!data || !action) {
				this.set('info2', " Please complete device and action ");
			} else if (data && action) {
				var object = " set " + data + " " + action;
				this.get('tasks').push(object);
				this.set('info2', " Saved ");
			}
			
			console.log(data + " and " + action + " and " + this.get('time2'));
		},
		
		save3(data, action) {
			if (!data || !action) {
				this.set('info3', " Please complete device and action ");
			} else if (data && action) {
				var object = " set " + data + " " + action;
				this.get('tasks').push(object);
				this.set('info3', " Saved ");
			}
			
			console.log(data + " and " + action + " and " + this.get('time3'));
		},
		
		settime1(event) {
			this.set('time1', event.target.value);
		},
		
		settime2(event) {
			this.set('time2', event.target.value);
		},
		
		settime3(event) {
			this.set('time3', event.target.value);
		},
		
		deletemini1(data, action) {
			this.set('firstdevice', " ");
			this.set('action1', " ");
			this.set('info1', " ");
			
			for (var i=0; i <= this.get('tasks').length; i++) {
				if (this.get('tasks')[i].includes(data + " " + action)) {
					this.get('tasks').splice(i, 1);
					this.set('info1', " Deleted ");
				}
			}
		},
		
		deletemini2(data, action) {
			this.set('seconddevice', " ");
			this.set('action2', " ");
			this.set('info2', " ");
			
			for (var i=0; i <= this.get('tasks').length; i++) {
				if (this.get('tasks')[i].includes(data + " " + action)) {
					this.get('tasks').splice(i, 1);
					this.set('info2', " Deleted ");
					console.log(this.get('tasks'));
				}
			}
		},
		
		deletemini3(data, action) {
			this.set('thirddevice', " ");
			this.set('action3', " ");
			this.set('info3', " ");
			for (var i=0; i <= this.get('tasks').length; i++) {
				if (this.get('tasks')[i].includes(data + " " + action)) {
					this.get('tasks').splice(i, 1);
					this.set('info3', " Deleted ");
					console.log(this.get('tasks'));
				}
			}
		},
		
	},
});
