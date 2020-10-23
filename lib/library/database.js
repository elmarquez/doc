const constants = require('../constants');
const { join } = require('path');
const Promise = require('bluebird');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

/**
 * Database wrapper.
 */
class Database {

    conn = null; // database connection
    path = null; // database file path

    /**
     * Constructor
     * @param {string} cwd - Path to project root 
     */
    constructor(cwd) {
        this.path = join(cwd, constants.DEFAULT_DATABASE_FILENAME)
        this.conn = null;
    }

    /**
     * Close the database connection.
     * @returns {Promise}
     */
    close() {
        return this.conn.close();
    }

    /**
     * Open a connection to the database.
     * @returns {Promise}
     * TODO consider renaming to open
     */
    connect() {
        const self = this;
        self.conn = new Sequelize({
            dialect: 'sqlite',
            dialectOptions: {},
            logging: null,
            pool: { max: 5, min: 0, idle: 10000 },
            retry: { max: 10 },
            storage: self.path,
            transactionType: 'IMMEDIATE'
        });
        defineModels(self.conn);
        return self.conn.sync();
    }

    getConnection() {
        return this.conn;
    }

    /**
     * Get document record.
     * @param {string} p - Document path 
     * @returns {promise}
     */
    getDocument(p) {
        throw new Error('not implemented');
    }

    /**
     * Get document record.
     * @param {string} p - Document path 
     * @returns {promise}
     */
    getDocumentExists(p) {
        throw new Error('not implemented');
    }

    /**
     * Get the list of all identifying file paths and hashes. 
     * @returns {promise|array} list of document paths
     */
    getDocumentIdentifiers() {
        return this.conn.models.Document.findAll({ attributes: ['path', 'hash'] });
    }

    /**
     * Get documents.
     * @returns {promise|array}
     */
    getDocuments() {
        return this.conn.models.Document.findAll();
    }
    
    /**
     * Get database path.
     */
    getPath() {
        return this.path;
    }

    /**
     * Determine if the database contains the document paths.
     * @param {array} paths - Document paths
     * @returns {promise|array} 
     */
    hasDocumentPaths(paths) {
        return this.getDocumentIdentifiers().then(function(docs) {
            const set = docs.reduce(function(s, d) {
                s.add(p.path);
                return s;
            }, new Set());
            return paths.map(p => set.has(p));
        });
    }

    /**
     * Purge the database of all data.
     * @returns {Promise}
     */
    purge() {
        return this.conn.drop();
    }
}

/**
 * Define models.
 * @param {object} conn - Database connection
 */
function defineModels(conn) {
    conn.define('Document',
        {
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
                type: DataTypes.DATE
            }
        },
        { tableName: 'Documents' }
    );
    conn.define('Tag',
        {
            tag: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
                unique: true
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        { tableName: 'Tags' }
    );
}


module.exports = Database;