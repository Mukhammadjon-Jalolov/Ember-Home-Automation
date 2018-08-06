import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service} from '@ember/service';

export default Component.extend({
	socketIOService: service('socket-io'),
	realmodel: [],
	energymodel: [],
	
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
					var energy = [];
					var stringdata = data.join("");
					var re = /Bye.../gi;
					var purestr = stringdata.replace(re, " ");
					var jsobj = JSON.parse(purestr);
					for (var i=0; i < jsobj.Results.length; i++){
							if(!/((schedule)|(new)|(fs20log)|(temp)|(telnet)|(WEB)|(autocreate)|(global)|(Logfile)|(initialUsb)|(eventTypes))/.test(jsobj.Results[i].Name)){
								
								if (jsobj.Results[i].Internals.STATE=="off"){
									jsobj.Results[i].Internals.NR = false;
								}
								
								else if (!jsobj.Results[i].Internals.STATE=="off"){
									jsobj.Results[i].Internals.NR = true;
								}

								rawrealmodel.push(jsobj.Results[i]);
								
								}
							
							if (/energy/.test(jsobj.Results[i].Name)){
									energy.push(jsobj.Results[i].Name);
								}
						}
						
					self.set('realmodel', rawrealmodel);
					self.set('energymodel', energy);
            });
			
		socket.on('value', function(data) {
		self.assign(data);
		console.log(self.get('energymodel'));
		//self.charter();
		});
		
	},
	
	assign: function(data){
		var devnam = "";
		for (devnam in data) {
		for (var i=0; i < this.get('realmodel').length; i++) {
		if (this.get('realmodel')[i].Name === devnam){
			var elem = this.get('realmodel')[i].Internals;
			Ember.set(elem, 'STATE', data[devnam]);
				if (this.get('realmodel')[i].Internals.STATE==="off"){
					Ember.set(elem, 'NR', false);
				}
				else {
					Ember.set(elem, 'NR', true);
				}
			}
		}
	}
	},
	
/*	charter: function(){
		for (var i=0; i < this.get('energymodel').length; i++) {
			this.get('linelab').push(this.get('energymodel')[i].Name);
		}
	},*/
	
	
	linelab: ["TV", "lamps", "Heater"],
	lineval: [7.3, 3.9, 2.1],
	
	options: {
    responsive: false
	},
	
	piedata: computed('lineLabel', function(){
		var labels = [];
		var data = [];
		
		//this.set('labels', this.get('energymodel'));
		
		for (var i=0; i < this.get('linelab').length; i++){
			labels.push(this.get('linelab')[i]);
			//labels.push(this.get('energymodel')[0]);
			data.push(parseInt(this.get('lineval')[i]));
		};
		
		return {
			labels: labels,
			datasets: [
				{
                backgroundColor: ['#ff6384', '#cc65fe'],
				data
				}
			]
		};
	})
	
});
