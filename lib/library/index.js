const Database = require('./database');
const files = require('./files');
const path = require('path');
const ProgressBar = require('progress');

const DEFAULT_FILE_TYPES = ['gif','jpeg','jpg','pdf','png','tif','tiff'];

// TODO create a .doc project subdirectory
// TODO move database into subdirectory

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
 * Configure document indexing options.
 * @param {object} argv - Command arguments
 * @returns {Promise}
 */
function config(argv) {
    console.error('not implemented');
}

/**
 * Export document index to file.
 * @param {object} argv - Command arguments
 * @returns {Promise}
 */
function exportToFile(argv) {
    console.error('not implemented');
}

/**
 * Get file information.
 * @param {object} argv - Command arguments
 */
async function info(args) {
    console.info('info', args);
    const db = new Database(args.path);
    const { conn } = await db.connect();
    if (args.changes === 'added') {
        const f = await files.getAddedFiles(args.path, DEFAULT_FILE_TYPES);
        console.info(f);
    }
    if (args.changes === 'deleted') {
        const f = await files.getDeletedFiles(args.path, DEFAULT_FILE_TYPES);
        console.info(f);
    }
    if (args.changes === 'updated') {
        const f = await files.getUpdatedFiles(args.path, DEFAULT_FILE_TYPES);
        console.info(f);
    }
}

/**
 * Initialize the document index.
 * @param {object} argv - Command arguments
 */
function init(argv) {
    console.error('not implemented');
    // TODO ensure directory exists
    // TODO create metadata files
    // TODO create git repository
}

/**
 * Purge index.
 * @param {object} argv - Command arguments
 */
function purge(args) {
    console.info(`Purging library index at ${args.path}`);
    const db = new Database(args.path);
    return db.connect().then(() => db.purge());
}

/**
 * Update the document index.
 * @param {object} args - Command arguments
 */
function update(args) {
    const db = new Database(args.path);
    return db
        .connect()
        .then(() => db.update())
        .then((stats) => console.info)
        .catch(console.error);
}

module.exports = {
    command,
    config,
    exportToFile,
    info,
    init,
    purge,
    update
};
