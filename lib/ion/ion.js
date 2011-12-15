/**
 * ion namespace.
 * 
 * All classes and functions will be attached to this object to keep the global namespace clean.
 */
window.ion = {};

/* Functions */

/**
 * Extends a constructor with the prototype of another.
 * 
 * When using this, it's required to include a call to the constructor of the parent class as the
 * first code in the child class's constructor.
 * 
 * @example
 *     // Define parent class
 *     function Foo() {
 *         // code here
 *     }
 *     // Define child class
 *     function Bar() {
 *         // Call parent constructor
 *         Foo.call( this );
 *     }
 *     // Extend prototype
 *     seq.extendClass( Bar, Foo );
 * 
 * @static
 * @method
 * @param {Function} dst Class to extend
 * @param {Function} src Base class to use methods from
 */
ion.extendClass = function( dst, src ) {
	var base = new src();
	for ( var method in base ) {
		if ( typeof base[method] === 'function' && !( method in dst.prototype ) ) {
			dst.prototype[method] = base[method];
		}
	}
};
