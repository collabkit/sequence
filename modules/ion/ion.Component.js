/**
 * Component.
 *
 * @class
 * @abstract
 *
 * @constructor
 */
ion.Component = function () {
	// Properties
};

/* Static Properties */

ion.Component.types = {};

/* Static Methods */

/**
 * Create a component from an object.
 *
 * @static
 * @method
 * @param {obj} obj Plain object
 */
ion.Component.newFromObject = function ( obj ) {
	var types = ion.Component.types;

	if ( obj.t in types ) {
		return types[obj.t].newFromObject( obj );
	}

	return null;
};
