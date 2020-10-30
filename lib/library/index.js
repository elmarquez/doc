const Database = require('./database');
const files = require('./files');
const hasha = require('hasha');
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
function purge(argv) {
    console.info(`Purging library index at ${argv.path}`);
    const db = new Database(args.path);
    return db.connect().then(() => db.purge());
}

/**
 * Update the document index.
 * @param {object} argv - Command arguments
 */
async function update(argv) {
    const db = new Database(args.path);
    return db
        .connect()
        .then(() => db.purge())
        .then(function () {
            const types = DEFAULT_FILE_TYPES.join(',');
            return files.getFiles(argv.path, types);
        })
        .then(async function (docs) {
            // const bar = new ProgressBar(':bar :current/:total :eta :file', { total: cfg.files.length });
            docs.forEach(async function (f) {
                await updateFile(conn, argv.path, f);
                // bar.tick({file: f});
            });
            return {
                added: -1,
                count: files.length,
                moved: -1,
                removed: -1,
                updated: -1
            };
        })
        .catch(console.error);
}

/**
 * Update or create document record.
 * @param {object} conn - Database connection
 * @param {string} cwd - Library root
 * @param {string} file - File path
 * @returns {Promise}
 */
async function updateFile(conn, cwd, file) {
    const { Document } = conn.models;
    const fp = path.join(cwd, file);
    const hash = await hasha.fromFile(fp, { algorithm: 'md5' });
    const where = { path: file };
    const defaults = {
        path: file,
        filename: path.basename(file),
        extension: path.extname(file).slice(1),
        hash
    };
    try {
        await Document.findOrCreate({ where, defaults });
    } catch (err) {
        console.error(err);
    }
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
