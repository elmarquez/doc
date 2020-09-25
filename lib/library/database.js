const constants = require('../constants');
const path = require('path');
const Promise = require('bluebird');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const models = {};

/**
 * Connect to database.
 * @param {string} cwd - Library path
 * @returns {Promise} - Database connection
 */
function connect(cwd) {
    const conn = getConnection(cwd);
    const models = defineModels(conn);
    const Document = models.Document;
    conn.sync();
    return Promise.resolve({ conn, Document, models });
}

function defineModels(conn) {
    models.Document = conn.define('Document', {
        path: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        extension: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hash: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        lastModified: {
            type: DataTypes.STRING
        },
        tags: {
            get: function () {
                this.getDataValue('tags').split('\n');
            },
            set: function (arr) {
                this.setDataValue('tags', arr.join('\n'));
            },
            type: DataTypes.STRING
        },
    },
        {
            tableName: 'Documents'
        }
    );
    conn.sync();
}

/**
 * Get database connection.
 * @param {string} cwd 
 */
function getConnection(cwd) {
    const dbPath = path.join(cwd, constants.DEFAULT_DATABASE_FILENAME);
    // create database connection
    return new Sequelize({
        dialect: 'sqlite',
        dialectOptions: {},
        logging: null,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        retry: {
            max: 10
        },
        storage: dbPath,
        transactionType: 'IMMEDIATE'
    });
}

/**
 * Get document record.
 * @param {string} p - Document path 
 * @returns {promise}
 */
function getDocument(p) {
    throw new Error('not implemented');
}

/**
 * Get document record.
 * @param {string} p - Document path 
 * @returns {promise}
 */
function getDocumentExists(p) {
    throw new Error('not implemented');
}

/**
 * Get the list of all identifying file paths and hashes. 
 * @returns {promise|array} list of document paths
 */
function getDocumentIdentifiers() {
    return models.Document.findAll({
        attributes: ['path', 'hash']
    });
}

/**
 * Purge the database.
 * @param {string} cwd - Library path
 */
function purge(cwd) {
    const conn = getConnection(cwd);
    return conn.drop().catch((err) => console.error);
}


module.exports = {
    connect,
    getDocument,
    getDocumentExists,
    getDocumentIdentifiers,
    purge
};