/**
 * Property component.
 *
 * @class
 *
 * @constructor
 */
ion.Component.Property = function ( key, oldVal, newVal ) {
	// Properties
	this.key = key;
	this.oldValue = oldVal;
	this.newValue = newVal;
};

/* Static Methods */

/**
 * Create a component from an object.
 *
 * @static
 * @method
 * @param {obj} obj Plain object
 */
ion.Component.Property.newFromObject = function ( obj ) {
	return new ion.Component.Property( obj.k, obj.ov, obj.nv );
};

/* Methods */

/**
 * Get plain object.
 *
 * @method
 * @returns {string} Serialized component
 */
ion.Component.Property.prototype.toObject = function () {
	return { k: this.key, ov: this.oldValue, nv: this.newValue };
};

/* Registration */

ion.Component.types.property = ion.Component.Property;
