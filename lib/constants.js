const pkg = require('../package.json');

module.exports = {
    DOC_FOLDER: '.doc',
    DEFAULT_DATABASE_FILENAME: 'metadata.sqlite',
    DEFAULT_FILE_TYPES: ['adoc','bib','gif','jpeg','jpg','json','md','pdf','png','svg','tif','tiff','txt'], // TODO index all files but add a config file where you can name exclusions
    PACKAGE_DESCRIPTION: pkg.description,
    PACKAGE_NAME: pkg.name,
    PACKAGE_VERSION: pkg.version
};
