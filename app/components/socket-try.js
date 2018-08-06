import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service} from '@ember/service';

export default Component.extend({
	socketIOService: service('socket-io'),
	realmodel: [],
	
	didInsertElement() {
	this._super(...arguments);
    const socket = this.get('socketIOService').socketFor('ws://194.95.194.122:8086/');
	this.set('socket', socket);
	self = this;
	
	socket.on('connect', function() {});
	socket.emit('getAllValuesOnChange');
	socket.emit('getAllDevicesOnChange');
	socket.emit('getReadingOnChange', {
				unit: 'unit-name',
				reading: 'reading-name'
			});
	
	socket.emit('command', 'jsonlist2', function (data) {
					var rawrealmodel = [];
					var stringdata = data.join("");
					var re = /Bye.../gi;
					var purestr = stringdata.replace(re, " ");
					var jsobj = JSON.parse(purestr);
					for (var i=0; i < jsobj.Results.length; i++){
							if(!/((schedule)|(new)|(fs20log)|(temp)|(telnet)|(WEB)|(autocreate)|(global)|(Logfile)|(initialUsb)|(eventTypes))/.test(jsobj.Results[i].Name)){
								rawrealmodel.push(jsobj.Results[i]);
							}
						}
					self.set('realmodel', rawrealmodel);
					
            });
			
		socket.on('value', function(data) {
		self.assign(data);
		});
		
	},
	
	assign: function(data){
		var devnam = "";
		for (devnam in data) {
		for (var i=0; i < this.get('realmodel').length; i++) {
		if (this.get('realmodel')[i].Name === devnam){
			
			var elem = this.get('realmodel')[i].Internals;
			Ember.set(elem, 'STATE', data[devnam]);
			}
		}
	}
	},
	
	actions: {
		sendButtonPressed: function(data, another){
			if (another == "off") {this.get('socket').emit("command", "set " + data + " on");
			}
			else {this.get('socket').emit("command", "set " + data + " off");}
		},
		
		rangeaction: function(data, event){
			this.get('socket').emit("command", "set " + data + " dim" + event.target.value + "%");
		}
	},
});
