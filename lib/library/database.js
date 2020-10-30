const constants = require('../constants');
const { join } = require('path');
const Promise = require('bluebird');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

/**
 * Database wrapper.
 */
class Database {

    conn = null;            // database connection
    dbPath = null;          // database path
    metadataPath  = null;   // .doc directory
    projectPath = null;     // project path

    /**
     * Constructor
     * @param {string} projectPath - Project path
     */
    constructor(projectPath) {
        this.dbPath = join(projectPath, constants.DEFAULT_DATABASE_FILENAME);
        this.metadataPath = join(projectPath, constants.DOC_FOLDER);
        this.projectPath = projectPath;
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
        // TODO ensure .doc folder
        self.conn = new Sequelize({
            dialect: 'sqlite',
            dialectOptions: {},
            logging: null,
            pool: { max: 5, min: 0, idle: 10000 },
            retry: { max: 10 },
            storage: self.dbPath,
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
     * @param {object} query - Document query
     * @returns {promise}
     */
    getDocument(query) {
        return this.conn.models.Document.findOne({ where: { ...query } });
    }

    /**
     * Get document record.
     * @param {object} query - Document query
     * @returns {promise}
     */
    getDocumentExists(query) {
        return this.getDocument(query).then(function(doc) {
            return !!doc;
        });
    }

    /**
     * Get the list of all identifying file paths and hashes. 
     * @returns {promise|array} list of document paths
     */
    getDocumentIdentifiers() {
        return this.conn.models.Document.findAll({ attributes: ['path', 'hash'] });
    }

    /**
     * Get all documents.
     * @param {object} query - Document query
     * @returns {promise|array}
     */
    getDocuments(query) {
        return this.conn.models.Document.findAll({ where: { ...query } });
    }
    
    /**
     * Get the project path.
     * @returns {string} project path
     */
    getProjectPath() {
        return this.projectPath;
    }

    /**
     * Get all tags.
     * @returns {promise|array}
     */
    getTags() {
        throw new Error('not implemented');
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