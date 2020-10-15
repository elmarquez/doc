const db = require('./database');
const fs = require('fs');
const hasha = require('hasha');
const path = require('path');
const Promise = require('bluebird');
const tinyglob = require('tiny-glob');
const utils = require('../utils');

/**
 * Determine if a file does not exist.
 * @param {string} p - File path 
 * @returns {Promise|boolean}
 */
async function doesNotExist(p) {
    return await exists(p).then((e) => !e);
}

/**
 * Determine if a file exists and is readable at the given path.
 * @param {string} p - File path 
 * @returns {Promise|boolean}
 */
function exists(p) {
    return new Promise(function (resolve) {
        fs.access(p, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, function (err) {
            resolve(!err);
        });
    });
}

/**
 * Get the list of added files.
 * @param {string} cwd - Project path
 * @returns {Promise} list of file paths
 */
function getAddedFiles(cwd) {
    return getFiles(cwd).then(function(files) {
        // TODO if it doesn't exist in the database then its been added
    });
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
async function getDeletedFiles(cwd) {
    return getCurrentFiles(cwd).then(function(files) {
        const filter = function (f) { return doesNotExist(path.join(cwd, f.path)) };
        return utils.asyncFilter(files, filter);
    });
}

/**
 * Get the list of files in the project path.
 * @param {string} cwd - Project path
 * @param {array} types - File type extensions 
 * @returns {Promise} list of file paths
 */
async function getFiles(cwd, types) {
    types = types || [];
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
    getCurrentFiles,
    getDeletedFiles,
    getFiles,
    getUpdatedFiles,
};
