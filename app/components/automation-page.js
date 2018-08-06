import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service} from '@ember/service';

export default Component.extend({
	socketIOService: service('socket-io'),
	
	didInsertElement() {
		this._super(...arguments);
		const socket = this.get('socketIOService').socketFor('ws://194.95.194.122:8086/');
		this.set('socket', socket);
		self = this;
		
		socket.on('connect', function() {});
		socket.emit('command', 'jsonlist2', function (data) {
					var rawrealmodel = [];
					var stringdata = data.join("");
					var re = /Bye.../gi;
					var purestr = stringdata.replace(re, " ");
					var jsobj = JSON.parse(purestr);
					for (var i=0; i < jsobj.Results.length; i++){
							if(/(schedule)/.test(jsobj.Results[i].Name)){
								rawrealmodel.push(jsobj.Results[i]);
							}
						}
					self.set('tasks', rawrealmodel);
            });
		
	},
	
	realmod: ["Dimmer", "FS20device", "Lamp", "Switch"],
	commands: ["on", "off", "dim50%"],
	
	autodevice: '',
	commandtosend: '',
	starttime: '',
	tasks: [],
	
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
		
		sendcommand: function(data, dest){
			this.get('socket').emit("command", "define " + this.get('autodevice') + "schedule at " + this.get('starttime') + " set " + this.get('autodevice') + " " + this.get('commandtosend'));
		},
		
		cancelit: function(data){
			this.get('socket').emit("command", "delete " + data);
			window.alert("Cancelled ");
		}
		
	},
});
