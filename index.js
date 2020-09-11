#!/usr/bin/env node
const constants = require('./lib/constants');
const lib = require('./lib');
const path = require('path');
const yargs = require('yargs');

//-----------------------------------------------------------------------------
// Parse and execute command

// TODO add --debug flag to all commands to enable console logging
// TODO add --progress flag to all commands
yargs
  .scriptName("lib")
  .usage('$0 <cmd> [args]')
  .command('config', 'Configure document indexing options', lib.config)
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
  }, lib.exportToFile)
  .command('init', 'Initialize the project directory', lib.init)
  .command('update', 'Create or update document index', (yargs) => {
    yargs
      .coerce('database', path.resolve)
      .coerce('path', path.resolve)
      .option('database', {
        default: path.join(process.cwd(), constants.DEFAULT_DATABASE_FILENAME),
        describe: 'path to the database file',
        type: 'string',
      })
      .option('path', {
        default: process.cwd(),
        describe: 'path to the folder to be indexed',
        type: 'string',
      });
  }, lib.update)
  .epilogue('Documentation is available online at https://elmarquez.github.io/doc')
  .help()
  .version(constants.PACKAGE_VERSION)
  .default('--help')
  .argv;