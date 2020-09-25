#!/usr/bin/env node
const {bibliography, constants, library, project} = require('./lib');
const path = require('path');
const pkg = require('./package.json');
const yargs = require('yargs');

// Parse and execute command
// TODO add --debug flag to all commands to enable console logging
// TODO add --progress flag to all commands
yargs
  .scriptName(pkg.name)
  .usage('$0 <cmd> [args]')
  .command('config', 'Configure options', project.config)
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
    }, library.exportToFile)
  .command('init', 'Initialize the project directory', function(yargs) {
      yargs.option('path', {
        default: process.cwd(),
        describe: 'project directory path',
        type: 'string',
      });
    }, project.init)
  .command('library <cmd>', 'Document library', function(yargs) {
    yargs
      .command('info', 'Display file information', (y) => library.info(y.argv))
      .command('purge', 'Purge index', (y) => library.purge(y.argv))
      .command('update', 'Update the index', (y) => library.update(y.argv))
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
  })
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
  }, library.update)
  .epilogue('Documentation is available online at https://elmarquez.github.io/doc')
  .help()
  .version(constants.PACKAGE_VERSION)
  .argv;
