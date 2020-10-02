#!/usr/bin/env node
const {bib, config, constants, library, project} = require('./lib');
const path = require('path');
const pkg = require('./package.json');
const yargs = require('yargs');

// Parse and execute command
// TODO add --debug flag to all commands to enable console logging
// TODO add --progress flag to all commands
yargs
  .scriptName(pkg.name)
  .usage('$0 <cmd> [args]')
  .command('bib <cmd>', 'Bibliography', bib.command)
  .command('config', 'Configure options', config.command)
  .command('init', 'Initialize the project directory', function(yargs) {
      yargs.option('path', {
        default: process.cwd(),
        describe: 'project directory path',
        type: 'string',
      });
    }, project.init)
  .command('library <cmd>', 'Document library', library.command)
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
  .alias('bib', 'b')
  .alias('config', 'c')
  .alias('library', 'l')
  .alias('library', 'lib')
  .alias('update', 'u')
  .epilogue('Documentation is available online at https://elmarquez.github.io/doc')
  .help()
  .version(constants.PACKAGE_VERSION)
  .argv;
