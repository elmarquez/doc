const {spawn} = require("child_process");
const config = require('./config');
const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const template = require('./project.json');
const utils = require('../utils');

/**
 * Get the path to the first parent directory containing the project metadata
 * file.
 * @param {string} p - Path
 * @returns {Promise|string} path to the project root
 */
function getRootPath(p) {
    throw new Error('not implemented');
}

/**
 * Initialize project folder.
 * @param {object} args - Console arguments
 * @returns {Promise}
 */
function init(args) {
    utils
        .ensureFolder(args.path)
        .then(writeProjectJson)
        .then(writeGitIgnore)
        .then(initGitRepo);
}

/**
 * Initialize Git repository.
 * @param {string} prj - Project path
 * @returns {Promise}
 */
function initGitRepo(prj) {
    console.info('init git repo', prj);
    const options = {
        cwd: prj
    };
    return new Promise(function (resolve, reject) {
        const git = spawn("git", ["init"], options);
        git.on('close', function () {
            resolve(prj);
        })
        git.on('error', function (err) {
            reject(err);
        });
        git.stderr.on("data", data => {
            console.error(`${data}`);
        });
    });
}

/**
 * Determine if the path is the root or subdirectory of a project.
 * @param {string} p - Path
 * @returns {Promise|boolean} true if the path is the root or a subdirectory of a project
 */
function isProjectFolder(p) {
    throw new Error('not implemented');
}

/**
 * Read project JSON file.
 * @param {*} prj - Project path
 * @returns {Promise}
 */
function readProjectJson(prj) {
    return new Promise(function (resolve, reject) {
        const f = path.join(prj, constants.PROJECT_METADATA);
        fs.readFile(f, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            }
        });
    });
}

/**
 * Write default gitignore file if one does not already exist.
 * @param {*} prj - Project path
 * @returns {Promise}
 */
function writeGitIgnore(prj) {
    return new Promise(function (resolve, reject) {
        const p = path.join(__dirname, 'gitignore');
        fs.readFile(p, {encoding: 'utf8'}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                const p = path.join(prj, '.gitignore');
                fs.writeFile(p, data, {encoding: 'utf8'}, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(prj);
                    }
                });
            }
        });
    });
}

/**
 * Create default project JSON file if one does not already exist.
 * @param {*} prj - Project path
 * @returns {Promise}
 */
function writeProjectJson(prj) {
    return new Promise(function (resolve, reject) {
        const name = path.basename(prj);
        const json = {...template, name};
        const data = JSON.stringify(json, null, 4);
        const p = path.join(prj, constants.PROJECT_METADATA);
        fs.writeFile(p, data, {}, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(prj);
            }
        });
    });
}

module.exports = {
    config: config.configure,
    init,
    initGitRepo,
    readProjectJson,
    writeGitIgnore,
    writeProjectJson
};
