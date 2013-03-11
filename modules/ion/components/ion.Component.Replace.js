/**
 * Replace component.
 *
 * @class
 *
 * @constructor
 */
ion.Component.Replace = function ( rem, ins ) {
	// Properties
	this.remove = rem;
	this.insert = ins;
};

/* Static Methods */

/**
 * Create a component from an object.
 *
 * @static
 * @method
 * @param {obj} obj Plain object
 */
ion.Component.Replace.newFromObject = function ( obj ) {
	return new ion.Component.Replace( obj.d, obj.i );
};

/* Methods */

/**
 * Get plain object.
 *
 * @method
 * @returns {string} Serialized component
 */
ion.Component.Replace.prototype.toObject = function () {
	return { d: this.remove, i: this.insert };
};

/* Registration */

ion.Component.types.replace = ion.Component.Replace;
