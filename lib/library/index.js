const db = require('./database');
const files = require('./files');
const hasha = require('hasha');
const path = require('path');
const ProgressBar = require('progress');
const Promise = require('bluebird');
const tinyglob = require('tiny-glob');

const DEFAULT_FILE_TYPES = ['pdf'];


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
    const { conn } = await db.connect(args.path);
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
}

/**
 * Purge index.
 * @param {object} argv - Command arguments
 */
function purge(argv) {
    console.info(`Purging library index at ${argv.path}`);
    return db.purge(argv.path);
}

/**
 * Update the document index.
 * @param {object} argv - Command arguments
 */
async function update(argv) {
    // console.debug(`Searching '${argv.path} for documents ...`);
    const cwd = argv.path;
    return db
        .connect(argv.database)
        .then(async function (conn) {
            const options = { absolute: false, cwd, filesOnly: true, };
            const types = DEFAULT_FILE_TYPES.join(',');
            const files = await tinyglob(`**/*.{${types}}`, options);
            return { conn, files };
        })
        .then(async function (results) {
            const { conn, files } = results;
            // const bar = new ProgressBar(':bar :current/:total :eta :file', { total: cfg.files.length });
            files.forEach(async function (f) {
                console.info(f);
                await updateFile(conn, cwd, f);
                // bar.tick({file: f});
            });
            return { count: files.length };
        })
        .catch(function (err) {
            console.error(err);
        });
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
        hash,
        tags: []
    };
    try {
        const [doc, created] = Document.findOrCreate({ where, defaults });
    } catch (err) {
        console.dir(Document.findOrCreate);
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
