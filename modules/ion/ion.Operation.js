/**
 * Operation.
 *
 * @class
 *
 * @constructor
 * @param {ion.Component[]} [components] Initial components
 */
ion.Operation = function ( components ) {
	// Properties
	this.components = components || [];
};

/* Static Methods */

/**
 * Create an operation from an object.
 *
 * @static
 * @method
 * @param {Object} obj Plain object
 * @param {Object[]} obj.components Components
 */
ion.Operation.newFromObject = function ( obj ) {
	var i, len,
		components = [];

	for ( i = 0, len = obj.components.length; i < len; i++ ) {
		components[i] = ion.Component.newFromObject( obj.components[i] );
	}

	return new ion.Operation( components );
};

/* Methods */

/**
 * Convert to a plain object.
 *
 * @method
 * @returns {Object} Plain object
 * @returns {Object[]} return.components Components
 */
ion.Operation.prototype.toObject = function () {
	var i, len,
		components = [];

	for ( i = 0, len = this.components.length; i < len; i++ ) {
		components[i] = this.components[i].toObject();
	}

	return { components: components };
};
