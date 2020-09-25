const db = require('./database');
const files = require('./files');
const hasha = require('hasha');
const path = require('path');
const ProgressBar = require('progress');
const Promise = require('bluebird');
const tinyglob = require('tiny-glob');


const DEFAULT_FILE_TYPES = ['pdf'];

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
    console.info(`Searching '${argv.path} for documents ...`);
    db.connect(argv.database)
        .then(async function (cfg) {
            const options = {
                absolute: false,
                cwd: argv.path,
                filesOnly: true,
            };
            const types = DEFAULT_FILE_TYPES.join(',');
            const files = await tinyglob(`**/*.{${types}}`, options);
            return Promise.resolve({ ...cfg, files });
        })
        .then(async function (cfg) {
            // const bar = new ProgressBar(':bar :current/:total :eta :file', { total: cfg.files.length });
            cfg.files.forEach(async function (f) {
                console.info(f);
                await updateFile(cfg.Document, argv.path, f);
                // bar.tick({file: f});
            });
        })
        .catch(function (err) {
            console.error(err);
        });
}

/**
 * Update or create document record.
 * @param {object} Document - Document model
 * @param {string} cwd - Library root
 * @param {string} file - File path
 * @returns {Promise}
 */
async function updateFile(Document, cwd, file) {
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
    config,
    exportToFile,
    info,
    init,
    purge,
    update
};
