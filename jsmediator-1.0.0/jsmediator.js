function Module( key ){
	this.key = typeof key !== "undefined" ? key : uuid();
	this.handlers = [];
}

Module.prototype = {	
	handle: function( eventKey, eventData){					
		this.handlers.forEach( function( handler ){ 
			if( handler.eventKey === eventKey 
				&& typeof handler.callback === "function") 
				handler.callback( eventData )
		} );
	},	
	subscribe: function( eventKey, callback ){				
		if ( typeof callback === "function" )				
			this.handlers.push({ eventKey: eventKey, callback: callback });
	}	
}

function ModuleSet(){
	this.modules = []
}

ModuleSet.prototype = {
	add: function( module ) {
		if ( ! module instanceof Module ) return;
		this.modules.push( module );		
		module.moduleSet = this;
		return module;
	},
	createModule: function( key ) {
		var module = new Module( key );
		this.modules.push( module );		
		module.moduleSet = this;
		return module;
	},
	broadcast: function( eventKey, eventData, filterCallback ){	
		if ( typeof filterCallback === "function" ){
			this.modules.forEach( function( module ){ 
				if ( filterCallback.call( module ) )
					module.handle( eventKey, eventData );
			});					
		} else {
			this.modules.forEach( function(module){ 
				module.handle( eventKey, eventData );
			});						
		}				
	}
}