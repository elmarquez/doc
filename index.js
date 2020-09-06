const hasha = require('hasha');
const path = require('path');
const pkg = require('./package.json');
const Promise = require('bluebird');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const tinyglob = require('tiny-glob');
const yargs = require('yargs');

const DEFAULT_DATABASE_FILENAME = 'documents.sqlite';

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
    logging: console.log,
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
  return Promise.resolve({conn, Document});
}

/**
 * Configure document indexing options.
 * @param {object} argv - Command arguments
 */
function config(argv) {
  console.error('not implemented');
}

/**
 * Export document index to file.
 * @param {object} argv - Command arguments
 */
function exportToFile(argv) {
  console.error('not implemented');
}

/**
 * Initialize the document index.
 * @param {object} argv - Command arguments
 */
function init(argv) {
  console.error('not implemented');
}

/**
 * Update the document index.
 * @param {object} argv - Command arguments
 */
function update(argv) {
  console.info(`Searching '${argv.path} for documents ...`);
  const cwd = argv.path;
  connectToDatabase(argv.database)
    .then(async function (cfg) {
      const options = {
        absolute: false,
        cwd,
        filesOnly: true,
      };
      const files = await tinyglob('**/*.{pdf}', options);
      return Promise.resolve({...cfg, files});
    })
    .then(function (cfg) {
      return Promise.map(cfg.files, updateFile(cfg.Document, cwd), {concurrency: 2});
    })
    .catch(function (err) {
      console.error(err);
    });
}

/**
 * Update or create document record.
 * @param {object} Document - Document model
 * @param {string} cwd - Library root
 */
function updateFile(Document, cwd) {
  return async function (file) {
    console.info('file', file, cwd);
    const fp = path.join(cwd, file);
    const hash = await hasha.fromFile(fp, {algorithm: 'md5'});
    const where = { path: file };
    const defaults = {
      path: file, 
      filename: path.basename(file),
      extension: path.extname(file),
      hash,
      tags: []
    };
    try {
      const [doc, created] = Document.findOrCreate({where, defaults});
    } catch (err) {
      console.error(err);
    }
  }
}

//-----------------------------------------------------------------------------
// Parse and execute command

// TODO add --debug flag to all commands to enable console logging
// TODO add --progress flag to all commands
yargs
  .scriptName("lib")
  .usage('$0 <cmd> [args]')
  .command('config', 'Configure document indexing options', config)
  .command('export', 'Export document index in a specified format', (yargs) => {
    yargs
    .choices('format', ['csv', 'json', 'sql', 'yaml'])
    .option('format', {
      default: 'json',
      describe: 'file format',
      type: 'string',
    })
    .option('path', {
      default: process.cwd(),
      describe: 'export file path',
      type: 'string',
    });
  }, exportToFile)
  .command('init', 'Initialize the document index', init)
  .command('update', 'Create or update document index', (yargs) => {
    yargs
      .coerce('database', path.resolve)
      .coerce('path', path.resolve)
      .option('database', {
        default: path.join(process.cwd(), DEFAULT_DATABASE_FILENAME),
        describe: 'path to the database file',
        type: 'string',
      })
      .option('path', {
        default: process.cwd(),
        describe: 'path to the folder to be indexed',
        type: 'string',
      });
  }, update)
  .epilogue('Documentation is available online at https://elmarquez.github.io/doc')
  .help()
  .version(pkg.version)
  .argv;