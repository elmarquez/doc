#!/usr/bin/env node
const {bib, config, constants, library, project} = require('./lib');
const path = require('path');
const pkg = require('./package.json');
const yargs = require('yargs');

yargs
  .scriptName(pkg.name)
  .usage('$0 <cmd> [args]')
  .command('add <uri>', 'Add document to library', (yargs) => console.info(yargs))
  .command('bib <cmd>', 'Bibliography', bib.command)
  .command('config', 'Configure options', config.command)
  .command('get <uri>', 'Get document', (yargs) => console.info(yargs))
  .command('init', 'Initialize project directory', function(yargs) {
      yargs.option('path', {
        default: process.cwd(),
        describe: 'project directory path',
        type: 'string',
      });
    }, project.init)
  .command('library <cmd>', 'Document library', library.command)
  .command('open <uri>', 'Open document in viewer', (yargs) => console.info(yargs))
  .command('search <query>', 'Search for publications', (yargs) => console.info(yargs))
  .command('update', 'Update the library index', (yargs) => {
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
