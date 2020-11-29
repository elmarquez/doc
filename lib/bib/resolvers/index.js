const arxiv = require('./arxiv');

/**
 * Get the appropriate resolver for a given query.
 * @param {string} query - Search query
 * @returns {Promise}
 */
function getResolver(query) {
  return arxiv;
}

module.exports = {
  getResolver
};
