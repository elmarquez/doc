
/**
 * Add publication to bibliography.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function add(args) {
    throw new Error('not implemented');
}

/**
 * Parse console command.
 * @param {object} yargs - Console argument parser 
 */
function command (yargs) {
    yargs
        .command('info', 'Display file information', (y) => info(y.argv))
        .command('purge', 'Purge index', (y) => purge(y.argv))
        .command('update', 'Update the index', (y) => update(y.argv))
        .choices('changes', ['added', 'all', 'deleted', 'updated'])
        .option('changes', {
            default: 'updated',
            describe: 'List files that have changed',
            type: 'string',
        })
        .option('path', {
            default: process.cwd(),
            describe: 'project directory path',
            type: 'string',
        });
}

/**
 * Export bibliography to nw file.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function exportToFile(args) {
    throw new Error('not implemented');
}

/**
 * Download publications.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function get(args) {
    throw new Error('not implemented');
}

/**
 * Remove publication.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function remove(args) {
    throw new Error('not implemented');
}

/**
 * Search bibliography.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function search(args) {
    throw new Error('not implemented');
}

/**
 * Update bibliography.
 * @param {object} args - Command arguments
 * @returns {Promise}
 */
function update(args) {
    throw new Error('not implemented');
}

module.exports = {
    add,
    command,
    exportToFile,
    remove,
    search,
    update
};
