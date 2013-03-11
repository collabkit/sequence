/**
 * Document.
 *
 * @class
 *
 * @constructor
 * @param {Array} data Merged data
 */
function LinearHtml( data ) {
	var i, len, item, text,
		index = 0;

	this.contentBand = [];
	this.formatBand = [];
	this.attributeBand = [];
	this.metaBand = [];
	this.elementTypes = [];
	this.formats = [];
	this.formatHashes = {};

	for ( i = 0, len = data.length; i < len; i++ ) {
		text = '';
		item = data[i];
		while ( true ) {
			if ( typeof item === 'string' ) {
				text += item;
			} else if ( Array.isArray( item ) ) {
				text += item[0];
				this.paintFormat( index, index + 1, this.addFormats( item.slice( 1 ) ) );
			} else {
				break;
			}
			i++;
			item = data[i];
			index++;
		}
		if ( text.length ) {
			this.appendContent( text.split( '' ) );
		}
		if ( typeof item === 'object' ) {
			if ( item.element ) {
				this.appendContent( [this.addElementType( item.element )] );
				if ( item.attr ) {
					this.setAttribute( index, item.attr );
				}
				index++;
			} else if ( item.meta ) {
				this.addMetaItem( index, item );
			}
		}
	}
}

LinearHtml.tags = {
	'root': [
		'html'
	],
	'meta': [
		'head', 'title', 'base', 'link', 'meta', 'style', 'script', 'noscript'
	],
	'structure': [
		'body', 'section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'address',
		'main', 'ol', 'ul', 'li', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'div', 'table',
		'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th'
	],
	'content': [
		'p', 'hr', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
	],
	'format': [
		'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code',
		'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo',
		'span', 'br', 'wbr', 'ins', 'del'
	],
	'media': [
		'img', 'iframe', 'embed', 'object', 'param', 'video', 'audio', 'source', 'track', 'canvas',
		'map', 'area', 'svg', 'math'
	],
	'alien': [
		'form', 'fieldset', 'legend', 'label', 'input', 'button', 'select', 'datalist', 'optgroup',
		'option', 'textarea', 'keygen', 'output', 'progress', 'meter', 'details', 'summary',
		'command', 'menu'
	]
};

LinearHtml.prototype = {

	// Multi-band

	serialize: function ( from, to ) {
		var i, item, element,
			data = [];

		from = Math.max( 0, from !== undefined ? from : 0 );
		to = Math.min( this.contentBand.length, to !== undefined ? to : this.contentBand.length );

		for ( i = from; i < to; i++ ) {
			item = this.contentBand[i];
			if ( Array.isArray( this.metaBand[i] ) ) {
				data.push.apply( data, this.metaBand[i] );
			}
			if ( typeof item === 'number' ) {
				element = { element: this.elementTypes[item] };
				if ( typeof this.attributeBand[i] === 'object' ) {
					element.attr = this.attributeBand[i];
				}
				data.push( element );
			} else {
				if ( Array.isArray( this.formatBand[i] ) ) {
					data.push( [item].concat( this.getFormats( this.formatBand[i] ) ) );
				} else {
					data.push( item );
				}
			}
		}
		return data;
	},

	// Content band

	appendContent: function ( ins ) {
		this.contentBand.push.apply( this.contentBand, ins );
	},
	replaceContent: function ( offset, del, ins ) {
		this.contentBand.splice.apply( this.contentBand, [offset, del.length].concat( ins ) );
		return this;
	},

	// Format band

	paintFormat: function ( from, to, formats ) {
		var i;

		for ( i = from; i < to; i++ ) {
			if ( this.formatBand[i] === undefined ) {
				this.formatBand[i] = [];
			}
			this.formatBand[i].push.apply( this.formatBand[i], formats );
		}
		return this;
	},
	eraseFormat: function ( from, to, formats ) {
		var at, i, len, list, index;

		for ( at = from; at < to; at++ ) {
			list = this.formatBand[at];
			if ( Array.isArray( list ) ) {
				for ( i = 0, len = formats.length; i < len; i++ ) {
					index = list.indexOf( formats[i] );
					list.splice( index, 1 );
					if ( !list.length ) {
						this.formatBand[at] = undefined;
					}
				}
			}
		}
		return this;
	},
	expandFormatBand: function ( offset, gap ) {
		this.formatBand.splice( offset, 0, Array( gap ) );
		return this;
	},
	collpaseFormatBand: function ( offset, gap ) {
		this.formatBand.splice( offset, gap );
		return this;
	},

	// Attribute band

	setAttribute: function ( offset, key, val ) {
		var attr;

		if ( this.attributeBand[offset] === undefined ) {
			this.attributeBand[offset] = {};
		}
		if ( typeof key === 'object' ) {
			attr = key;
			for ( key in attr ) {
				this.attributeBand[offset][key] = attr[key];
			}
		} else {
			this.attributeBand[offset][key] = val;
		}
		return this;
	},
	removeAttribute: function ( offset, keys ) {
		var i, len, key;

		if ( this.attributeBand[offset] !== undefined ) {
			if ( Array.isArray( keys ) ) {
				for ( i = 0, len = keys.length; i < len; i++ ) {
					delete this.attributeBand[offset][keys[i]];
				}
			} else {
				delete this.attributeBand[offset][key];
			}
			for ( key in this.attributeBand[offset] ) {
				return;
			}
			delete this.attributeBand[offset];
		}
	},
	expandAttributeBand: function ( offset, gap ) {
		this.attributeBand.splice( offset, 0, Array( gap ) );
		return this;
	},
	collpaseAttributeBand: function ( offset, gap ) {
		this.attributeBand.splice( offset, gap );
		return this;
	},

	// Meta band

	addMetaItem: function ( offset, item ) {
		if ( this.metaBand[offset] === undefined ) {
			this.metaBand[offset] = [];
		}
		this.metaBand[offset].push( item );
		return this;
	},
	removeMetaItem: function ( offset, item ) {
		var index,
			list = this.metaBand[offset];

		if ( list !== undefined ) {
			index = list.indexOf( item );
			if ( index !== -1 ) {
				list.splice( index, 1 );
			}
		}
		if ( !list.length ) {
			this.metaBand[offset] = undefined;
		}
		return this;
	},
	expandMetaBand: function ( offset, gap ) {
		this.metaBand.splice( offset + 1, 0, Array( gap ) );
		return this;
	},
	collpaseMetaBand: function ( offset, gap ) {
		var i, len,
			remainder = [],
			removed = this.metaBand.splice( offset + 1, gap );

		for ( i = 0, len = removed.length; i < len; j++ ) {
			if ( removed[i] !== undefined ) {
				remainder.push.apply( remainder, removed[i] );
			}
		}
		if ( remainder.length ) {
			if ( this.metaBand[offset] === undefined ) {
				this.metaBand[offset] = [];
			}
			this.metaBand[offset].push.apply( this.metaBand[offset], remainder );
		}
		return this;
	},

	// Element types

	addElementTypes: function ( types ) {
		var i, len,
			indexes = [];

		for ( i = 0, len = types.length; i < len; i++ ) {
			indexes.push( this.add( types[i] ) );
		}
		return indexes;
	},
	addElementType: function ( type ) {
		var index = this.elementTypes.indexOf( type );
		return index !== -1 ? index : this.elementTypes.push( type ) - 1;
	},
	getElementTypeIndex: function ( type ) {
		return this.elementTypes.indexOf( type );
	},
	getElementTypes: function ( indexes ) {
		var i, len,
			types = [];

		for ( i = 0, len = indexes.length; i < len; i++ ) {
			types.push( this.add( indexes[i] ) );
		}
		return types;
	},
	getElementType: function ( index ) {
		return index !== undefined ? this.elementTypes[index] : this.elementTypes.slice( 0 );
	},

	// Formats

	addFormats: function ( formats ) {
		var i, len,
			indexes = [];

		for ( i = 0, len = formats.length; i < len; i++ ) {
			indexes.push( this.addFormat( formats[i] ) );
		}
		return indexes;
	},
	addFormat: function ( formats ) {
		var hash = JSON.stringify( formats );
		return hash in this.formatHashes ?
			this.formatHashes[hash] : this.formatHashes[hash] = this.formats.push( formats ) - 1;
	},
	getFormatIndex: function ( format ) {
		var hash = JSON.stringify( format );
		return hash in this.formatHashes ? this.formatHashes[hash] : -1;
	},
	getFormats: function ( indexes ) {
		var i, len,
			formats = [];

		for ( i = 0, len = indexes.length; i < len; i++ ) {
			formats.push( this.getFormat( indexes[i] ) );
		}
		return formats;
	},
	getFormat: function ( index ) {
		return index !== undefined ? this.formats[index] : this.formats.slice( 0 );
	}
};
