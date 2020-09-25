const db = require('./database');
const fs = require('fs');
const hasha = require('hasha');
const path = require('path');
const Promise = require('bluebird');
const tinyglob = require('tiny-glob');


/**
 * Determine if a file exists and is readable at the given path.
 * @param {string} p - File path 
 * @returns {Promise|boolean}
 */
function exists(p) {
    return new Promise(function (resolve) {
        fs.access(p, fs.constants.F_OK, function (err) {
            resolve(err ? false : true);
          });
    });
}

/**
 * Get the list of added files.
 * @param {string} cwd - Project path 
 * @param {array} types - File type extensions 
 * @returns {Promise} list of file paths
 */
function getAddedFiles(cwd, types) {
    throw new Error('not implemented');
}

/**
 * Get the list of deleted files.
 * @param {string} cwd - Project path 
 * @param {array} types - File type extensions 
 * @returns {Promise} list of file paths
 */
function getDeletedFiles(cwd, types) {
    return db.getDocumentIdentifiers(cwd).then(function (docs) {
        return Promise.filter(docs, (obj) => !exists(obj.path));
    });
}

function getDocumentExists() {}

/**
 * Get the list of files in the project path.
 * @param {string} cwd - Project path
 * @param {array} types - File type extensions 
 * @returns {Promise} list of file paths
 */
async function getFiles(cwd, types) {
    const options = { absolute: false, cwd, filesOnly: true };
    const extensions = types.join(',');
    return await tinyglob(`**/*.{${extensions}}`, options);
}

/**
 * Get the list of updated files.
 * @param {string} cwd - Project path 
 * @param {array} types - File type extensions 
 * @returns {Promise} list of file paths
 */
function getUpdatedFiles(cwd, types) {
    throw new Error('not implemented');
}

module.exports = {
    getAddedFiles,
    getDeletedFiles,
    getFiles,
    getUpdatedFiles,
};