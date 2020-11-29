const got = require('got');

/**
 * Get Bibtex formatted citation.
 * @param {string} id - Publication ID
 * @returns {Promise} bibtex format citation
 */
async function getCitation(id) {
  id = '2011.06502';
  const url = `https://arxiv.org/bibtex/${id}`;
  // TODO add the URL into the citation
  const res = await got(url);
  return res.body;
}

/**
 * Get PDF publication.
 * @param {string} id - Publication ID
 * @returns {Promise} PDF document
 */
async function getDocument(id) {
  id = '2011.06502';
  const url = `https://arxiv.org/pdf/${id}`;
  return await got(url);
}

/**
 * Get references included in the publication.
 * @returns {Promise}
 */
async function getReferences(id) {
  id = '2011.06502';
  const repo = 'arXiv';
  const url = `https://partner.semanticscholar.org/v1/paper/${repo}:${id}?include_unknown_references=true`;
  return await got(url);
}

/**
 * Determine if the query refers to a publication beloning to this publisher.
 * @param {string} query - Query
 * @return {Promise|boolean} true if the query can be resolved by this publisher
 */
function isPublication(query) {
  const q = query.trim().toLowerCase();
  if (q.indexOf('arxiv:') === 0) {
    throw new Error('not implemented');
  } else if (q.indexOf('https://arxiv.org/') === 0) {
    return true;
  } else if (q.indexOf('doc:pub:arxiv') === 0) {
    throw new Error('not implemented');
  }
}

module.exports = {
  getCitation,
  getDocument,
  getReferences,
  isPublication
};
