const pkg = require('../package.json');

module.exports = {
    DEFAULT_DATABASE_FILENAME: 'documents.sqlite',
    PACKAGE_DESCRIPTION: pkg.description,
    PACKAGE_NAME: pkg.name,
    PACKAGE_VERSION: pkg.version
};
