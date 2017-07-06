const Font = function(family, weight, size) {
	return {
		family: family || 'monospace',
		weight: weight || 'normal',
		size: size || 16,
		toCSS: function() {
			return this.weight + ' '+ this.size +'px ' + this.family;
		}
	}
}

export default Font;
