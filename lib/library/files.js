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
        fs.access(p, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, function (err) {
            resolve(err === null);
        });
    });
}

/**
 * Get the list of added files.
 * @param {string} cwd - Project path
 * @returns {Promise} list of file paths
 */
function getAddedFiles(cwd) {
    throw new Error('not implemented');
}

/**
 * Get the current index of files.
 * @param {string} cwd - Project path 
 * @returns {Promise} list of file paths, hashes
 */
function getCurrentFiles(cwd) {
    return db.getDocumentIdentifiers(cwd);
}

/**
 * Get the list of deleted files.
 * @param {string} cwd - Project path 
 * @returns {Promise} list of file paths
 */
function getDeletedFiles(cwd) {
    return getCurrentFiles(cwd).then(function (docs) {
        return Promise.filter(docs, (f) => !exists(f.path, f.hash));
    });
}

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
 * Get list of files that have moved and where they have been moved to.
 * @param {string} cwd - Project path
 */
function getMovedFiles() {}

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
    exists,
    getAddedFiles,
    getDeletedFiles,
    getFiles,
    getUpdatedFiles,
};
