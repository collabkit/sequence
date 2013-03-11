/**
 * Retain component.
 *
 * @class
 *
 * @constructor
 */
ion.Component.Retain = function ( length ) {
	// Properties
	this.length = length;
};

/* Static Methods */

/**
 * Create a component from an object.
 *
 * @static
 * @method
 * @param {obj} obj Plain object
 */
ion.Component.Retain.newFromObject = function ( obj ) {
	return new ion.Component.Retain( obj.l );
};

/* Methods */

/**
 * Get plain object.
 *
 * @method
 * @returns {string} Serialized component
 */
ion.Component.Retain.prototype.toObject = function () {
	return { l: this.length };
};

/* Registration */

ion.Component.types.retain = ion.Component.Retain;
