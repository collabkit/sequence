/**
 * Creates a seq.Observable object.
 * 
 * @class
 * @abstract
 * @constructor
 * @property {Object} events
 */
seq.Observable = function() {
	this.events = {};
};

/* Methods */

/**
 * Gets a list of observers attached to an event.
 * 
 * @method
 * @param {String} type Type of event
 * @returns {Array} List of observers
 */
seq.Observable.prototype.getObservers = function( type ) {
	return type in this.events ? this.events[type] : [];
};

/**
 * Gets a count of observers attached to an event.
 * 
 * @method
 * @param type {String} Type of event
 * @returns {Integer} Number of observers
 */
seq.Observable.prototype.countObservers = function( type ) {
	return type in this.events ? this.events[type].length : 0;
};

/**
 * Notifies observers of an event.
 * 
 * @method
 * @param {String} type Type of event
 * @param {Mixed} [...] Arguments passed to event handler
 * @returns {Boolean} Event was handled by at least one observer
 */
seq.Observable.prototype.notify = function( type ) {
	if ( !( type in this.events ) ) {
		return false;
	}
	var observers = this.events[type].slice();
	var args = Array.prototype.slice.call( arguments, 1 );
	for ( var i = 0; i < observers.length; i++ ) {
		observers[i].apply( this, args );
	}
	return true;
};

/**
 * Adds an observer of an event.
 * 
 * @method
 * @param {String} type Type of event, or list of types of events separated by spaces
 * @param {Function} observer Observer to call when event occurs
 * @returns {seq.Observable} This object
 * @throws {Error} If observer argument is not a function
 */
seq.Observable.prototype.on = function( type, observer ) {
	if ( typeof type !== 'string' ) {
		throw new Error( 'Invalid type error. String expected.' );
	}
	if ( typeof observer !== 'function' ) {
		throw new Error( 'Invalid observer error. Function expected.' );
	}
	if ( type.indexOf( ' ' ) !== -1 ) {
		type = type.split( ' ' );
		for ( var i = 0; i < type.length; i++ ) {
			this.on( type[i], observer );
		}
	} else {
		this.notify( 'newObserver', type, observer );
		if ( type in this.events ) {
			this.events[type].push( observer );
		} else {
			this.events[type] = [observer];
		}
	}
	return this;
};

/**
 * Adds a one-time observer of an event.
 * 
 * @method
 * @param {String} type Type of event
 * @param {Function} observer Function to call when an event occurs
 * @returns {seq.Observable} This object
 */
seq.Observable.prototype.once = function( type, observer ) {
	var _this = this;
	return this.on( type, function wrapper() {
		_this.off( type, wrapper );
		observer.apply( _this, Array.prototype.slice.call( arguments, 0 ) );
	} );
};

/**
 * Removes an observer from an event.
 * 
 * @method
 * @param {String} [type] Event of observer, if ommitted remove all observers of all events
 * @param {Function} [observer] Observer to remove; if not ommitted remove all observers of an event
 * @returns {seq.Observable} This object
 */
seq.Observable.prototype.off = function( type, observer ) {
	var i;
	if ( type === undefined ) {
		// Remove all observers of all events
		this.events = {};
	} else {
		if ( typeof type !== 'string' ) {
			throw new Error( 'Invalid type error. String expected.' );
		}
		if ( type.indexOf( ' ' ) !== -1 ) {
			type = type.split( ' ' );
			for ( i = 0; i < type.length; i++ ) {
				this.off( type[i], observer );
			}
		} else {
			if ( observer === undefined ) {
				// Remove all observers of an event
				if ( type in this.events ) {
					delete this.events[type];
				}
			} else if ( observer !== undefined && type in this.events && this.events[type].length ) {
				// Remove an observer of an event
				var observers = this.events[type];
				for ( i = 0; i < observers.length; i++ ) {
					if ( observers[i] === observer ) {
						observers.splice( i, 1 );
						break;
					}
				}
				if ( observers.length === 0 ) {
					delete this.events[type];
				}
			}
		}
	}
	return this;
};
