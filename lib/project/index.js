const { spawn } = require("child_process");
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const template = require('./project.json');

/**
 * Ensure that the project directory exists.
 * @param {string} fp - Project path 
 * @returns {Promise} 
 */
function ensureProjectDirectory(fp) {
    return Promise.resolve(fp);
}

/**
 * Initialize project folder.
 * @param {String} fp - Project path
 * @returns {Promise} 
 */
function init(fp) {
    ensureProjectDirectory(fp)
    .then(writeProjectJson)
    .then(writeGitIgnore)
    .then(initGitRepo)
    // TODO ensure project directory
    // write project JSON
    // write .gitignore
    // iniialize git repo
    // create first commit?
}

/**
 * Initialize Git repository.
 * @param {string} fp - Project path
 * @returns {Promise} 
 */
function initGitRepo(fp) {
    const options = {
        cwd: fp
    };
    return new Promise(function (resolve, reject) {
        const git = spawn("git", ["init"], options);
        git.on('close', function() {
            resolve(fp);
        })
        git.on('error', function(err) {
            reject(err);
        });
        git.stderr.on("data", data => {
            console.error(`${data}`);
        });
        git.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
    });
}

/**
 * Write default gitignore file if one does not already exist.
 * @param {*} fp - Project path
 * @returns {Promise} 
 */
function writeGitIgnore(fp) {
    // TODO check to see if file already exists
}

/**
 * Create default project JSON file if one does not already exist.
 * @param {*} fp - Project path
 * @returns {Promise} 
 */
function writeProjectJson(fp) {
    // TODO check to see if file already exists
    const name = path.basename(fp);
    const json = {...template, name};
    const data = JSON.stringify(json, {space: 4});
    return new Promise(function (resolve, reject) {
        fs.writeFile(fp, data, {}, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    ensureProjectDirectory,
    init,
    initGitRepo,
    writeGitIgnore,
    writeProjectJson
};