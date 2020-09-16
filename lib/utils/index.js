const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

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

module.exports = {
    pathExists
};