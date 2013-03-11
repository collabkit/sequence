/**
 * Ion namespace.
 *
 * @singleton
 * @type {Object}
 */
window.ion = {};

function DataFragment( set, from, to ) {
	this.set = set;
	this.from = from || 0;
	this.to = to || this.set.length;
}

DataFragment.prototype = {

};

function DataSet( bands ) {
	this.bands = bands || {};
}

DataSet.prototype = {
	process: function ( op ) {
		var i, len, cmp, band, data, dst, cur, key, empty, on, t;

		for ( band in this.bands ) {
			cur = 0;
			data = this.bands[band];
			for ( i = 0, len = ops.components.length; i < len; i++ ) {
				cmp = op.components[i];
				if ( typeof op === 'number' ) {
					cur += op;
				} else {
					t = op[0];
					on = band === op[1];
					switch ( t ) {
						case 'p':
							if ( on ) {
								if ( data[cur] === undefined ) {
									data[cur] = {};
								}
								data[cur][op[1]] = op[3];
								empty = true;
								for ( key in data[cur] ) {
									if ( data[cur].hasOwnProperty( key ) ) {
										empty = false;
										break;
									}
								}
								if ( empty ) {
									delete data[cur];
								}
							}
							break;
						case 'r':
							if ( on ) {
								data.splice.apply( data, [ cur, op[1].length ].concat( op[2] ) );
							} else {
								data.splice.apply(
									data, [ cur, op[1].length ].concat( Array( op[2].length ) )
								);
							}
							cur += op[1].length;
							break;
					}
				}
			}
		}
	}
};

function DataOp( band ) {
	this.band = band;
	this.components = [];
	this.baseLength = 0;
	this.targetLength = 0;
}

DataOp.prototype = {
	retain: function ( len ) {
		this.components.push( Number( len ) );
		this.baseLength += len;
		this.targetLength += len;
		return this;
	},
	replace: function ( band, del, ins ) {
		this.components.push( ['r', String( band ), del || [], ins || []] );
		this.baseLength += del.length;
		this.targetLength += ins.length;
		return this;
	},
	prop: function ( band, key, from, to ) {
		this.components.push(
			['p', String( band ), String( key ), from || undefined, to || undefined]
		);
		return this;
	},
	invert: function () {
		var i, len, cmps, band, type,
			a = this,
			b = new DataOp( this.band );

		for ( i = 0, len = a.components.length; i < len; i++ ) {
			if ( typeof a[i] === 'number' ) {
				b.retain( a[i] );
			} else {
				cmps = a[i].components;
				band = a[i].band;
				type = cmps[0];
				switch ( type ) {
					case 'p':
						b.prop( band, a[1], a[3], a[2] );
						break;
					case 'r':
						b.replace( band, a[2], a[1] );
						break;
				}
			}
		}
		return b;
	},
	compose: function ( b ) {
		var a = this;
	},
	transform: function ( b ) {
		var a = this;
	}
};
