const glob = require('glob');
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
    storage: dbPath
  });  
  // define data models
  const Document = conn.define('Document', {
    path: {
      type: DataTypes.STRING,
      allowNull: false
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
        type: DataTypes.STRING,
        allowNull: false  
      },
      lastModified: {
        type: DataTypes.STRING
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
    },
    {
      // Other model options go here
    }
  );
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
      const tinyopts = {
        absolute: false,
        cwd,
        filesOnly: true,
      };
      const files = await tinyglob('**/*.{pdf}', tinyopts);
      return Promise.resolve({...cfg, files});
    })
    .then(function (cfg) {
      return Promise.map(cfg.files, updateFile(cfg.conn, cfg.Document, cwd));
    })
    .catch(function (err) {
      console.error(err);
    });
}

function updateFile(db, Document, cwd) {
  return async function (file) {
    const fp = path.join(cwd, file);
    const hash = await hasha.fromFile(fp, {algorithm: 'md5'});
    console.info(hash, file);
  }
}

//-----------------------------------------------------------------------------
// Parse and execute command

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