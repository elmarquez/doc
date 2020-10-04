const fs = require('fs');
const fsutils = require('nodejs-fs-utils');
const path = require('path');
const Promise = require('bluebird');


/**
 * Copy file or folders.
 * @param {string} src - Source path 
 * @param {string} dest - Destination path
 * @returns {Promise}
 */
function copyDir(src, dest) {
    return new Promise(function(resolve, reject) {
        fsutils.copySync(src, dest, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Determine if the path exists, is both readable and writeable by the current
 * user.
 * @param {string} prj - Path 
 * @returns {Promise}
 */
function pathExists(prj) {
    return new Promise(function(resolve, reject) {
        fs.access(prj, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, function(err) {
            if (err) {
                reject('path does not exist', err);
            } else {
                resolve(prj);
            }
        });
    });
}

/**
 * Walk file system path
 * @param {string} src 
 */
function walk(src) {
    return new Promise(function(resolve, reject) {
        let files = [];
        fsutils.walk(src, { skipErrors: true }, function (err, p, stats, next, cache) {
            if (!stats.isDirectory) {
                files.push(p);
            }
            next();
        }, function (cache) {
            resolve(files);
        });
    });
}


module.exports = {
    copyDir,
    pathExists,
    walk
};