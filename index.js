const { createRequireFromPath, createRequire } = require('module');

const create = createRequire || createRequireFromPath; // createRequire -> node >=12.2, createRequireFromPath -> node >=10.12

/**
 * Create modifiers to require cache based on path (e.g. `__dirname`)
 * @param  {String}   path
 * @return {Function}
 */
module.exports = function abuser(path) {
	const _require = create(require.resolve(path));

	/**
	 * Clean up a module from cache
	 * @param  {String} route
	 * @return {undefined}
	 */
	function clean(route) {
		// Resolve module location from given path
		const filename = _require.resolve(route);

		// Escape if this module is not present in cache
		if (!_require.cache[filename]) {
			return;
		}

		// Remove all children from memory, recursively
		shidu(filename);

		// Remove module from memory as well
		delete _require.cache[filename];
	}

	/**
	 * Override a module with any given thing
	 * @param  {String} route
	 * @param  {Any}    thing
	 * @return {Any}             New exports of the module
	 */
	function override(route, thing) {

		// Resolve module location from given path
		const filename = _require.resolve(route);

		// Load it into memory
		_require(filename);

		// Override exports with new value
		_require.cache[filename].exports = thing;

		// Return exports value
		return _require(filename);
	}

	/**
	 * Reset a module
	 * @param  {String}  route
	 * @return {Any}
	 */
	function reset(route) {

		// Resolve module location from given path
		const filename = _require.resolve(route);

		// Load it into memory
		_require(filename);

		// Remove all children from memory, recursively
		shidu(filename);

		// Remove module from memory as well
		delete _require.cache[filename];

		// Return exports value
		return _require(filename);
	}

	return { clean, override, reset };
};

/**
 * Remove all children from cache as well
 * @param  {String} parent
 * @return {undefined}
 */
function shidu(filename) {
	lineage(filename).forEach(item => {

		// Remove it from memory
		delete require.cache[item];
	});
}

/**
 * Collect a module lineage
 * @param  {String} filename
 * @param  {Set}    collection
 * @returns {Set}
 */
function lineage(filename, set = new Set()) {
	const parent = require.cache[filename];

	if (!parent) {
		return set;
	}

	// We'll delete everything later
	if (set.has(filename)) {
		return set;
	}

	set.add(filename);

	// If there are children - recurs through them parent.children
	parent.children
		.forEach(
			({ filename }) => lineage(filename, set),
		);

	return set;
}
