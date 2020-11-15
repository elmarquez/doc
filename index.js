#!/usr/bin/env node
const {bib, config, constants, library, project} = require('./lib');
const os = require('os');
const path = require('path');
const pkg = require('./package.json');
const yargs = require('yargs');

yargs
  .scriptName(pkg.name)
  .version(constants.PACKAGE_VERSION)
  .usage('$0 <cmd> [args]')
  .command('add <uri>', 'Add document to library', (y) => console.info(y))
  .command('bib <cmd>', 'Bibliography', bib.command)
  .command('config', 'Configure options', config.command)
  .command('get <uri>', 'Get document', (y) => console.info(y))
  .command('init', 'Initialize project directory', function(y) {
      y.option('path', {
        default: process.cwd(),
        describe: 'project directory path',
        type: 'string',
      });
    }, project.init)
  .command('library <cmd>', 'Document library', library.command)
  .command('open <uri>', 'Open document in viewer', (y) => console.info(y))
  .command('search <query>', 'Search for publications', (y) => console.info(y))
  .command('update', 'Update the library index', (y) => {
    y
      .coerce('database', path.resolve)
      .coerce('path', (p) => {
        // if the path includes a user home reference ~ then expand it to an
        // absolute path
        if (p.length > 0 && p[0] === '~') {
          p = path.join(os.homedir(), p.substring(1));
        }
        return path.resolve(path.normalize(p));
      })
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
  .argv;
