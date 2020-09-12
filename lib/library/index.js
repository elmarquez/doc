const hasha = require('hasha');
const path = require('path');
const ProgressBar = require('progress');
const Promise = require('bluebird');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const tinyglob = require('tiny-glob');

/**
 * Connct to database.
 * @param {string} dbPath - Path to database file
 * @returns {Promise} - Database connection
 */
function connectToDatabase(dbPath) {
    // create database connection
    const conn = new Sequelize({
        dialect: 'sqlite',
        dialectOptions: {},
        logging: null,
        retry: {
            max: 10
        },
        storage: dbPath,
        transactionType: 'IMMEDIATE'
    });
    // define data models
    const Document = conn.define('Document', {
        path: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        extension: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hash: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        lastModified: {
            type: DataTypes.STRING
        },
        tags: {
            get: function () {
                this.getDataValue('tags').split('\n');
            },
            set: function (arr) {
                this.setDataValue('tags', arr.join('\n'));
            },
            type: DataTypes.STRING
        },
    },
        {
            tableName: 'Documents'
        }
    );
    conn.sync();
    return Promise.resolve({ conn, Document });
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
 * Initialize the document index.
 * @param {object} argv - Command arguments
 * @returns {Promise}
 */
function init(argv) {
    console.error('not implemented');
}

/**
 * Update the document index.
 * @param {object} argv - Command arguments
 * @returns {Promise}
 */
async function update(argv) {
    console.info(`Searching '${argv.path} for documents ...`);
    return await connectToDatabase(argv.database)
        .then(async function (cfg) {
            const options = {
                absolute: false,
                cwd: argv.path,
                filesOnly: true,
            };
            const files = await tinyglob('**/*.{pdf}', options);
            return Promise.resolve({ ...cfg, files });
        })
        .then(async function (cfg) {
            // const bar = new ProgressBar(':bar :current/:total :eta :file', { total: cfg.files.length });
            cfg.files.forEach(async function (f) {
                console.info(f);
                await updateFile(cfg.Document, arvg.path, f);
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
        extension: path.extname(file),
        hash,
        tags: []
    };
    try {
        const [doc, created] = Document.findOrCreate({ where, defaults });
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    config,
    exportToFile,
    init,
    update
};
