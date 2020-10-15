const { expect } = require('chai');
const db = require('../../../lib/library/database');
const fs = require('fs');
const fsutils = require('nodejs-fs-utils');
const os = require('os');
const { join, sep } = require('path');

describe('lib / library / database ', function() {

    const fixtures = join(process.cwd(), 'test', 'fixtures');
    const state1 = join(fixtures, 'state1');
    const state2 = join(fixtures, 'state2');

    let tmp = null;

    beforeEach(function(done) {
        fs.mkdtemp(`${os.tmpdir()}${sep}test-`, function(err, dtemp) {
            if (err) throw new Error(err);
            tmp = dtemp;
            done();
        });
    });

    describe('connect', function() {
        it('returns a promise', function() {
            const promise = db.connect(tmp);
            expect(promise).to.have.property('then');
        });
        it('creates a connection to the database', function(done) {
            db.connect(tmp).then(function(conn) {
                expect(conn).to.exist;
                expect(conn.close).to.exist;
                expect(conn.models).to.exist;
                expect(conn.models.Document).to.exist;
                expect(conn.models.Tag).to.exist;
                done();
            })
            .catch(function(err) {
                fail(err);
            });
        });
    });

    describe('getDocumentIdentifiers', function() {
        it('returns a list with document path, hash for each entry', function(done) {
            db.getDocumentIdentifiers(tmp)
                .then(function(files) {
                    expect(Array.isArray(files)).to.be.true;
                    done();
                })
                .catch(function(err) {
                    fail(err);
                });
        });
    });

    describe('purge', function() {

        beforeEach(function(done) {
            fsutils.copy(state1, tmp, function (err) {
                if (err) console.error(err);
                done();
            });
        });

        it('returns a promise', function() {
            const promise = db.purge(tmp);
            expect(promise).to.have.property('then');
        });
        it('clears all contents from the database', function(done) {
            return db
                .connect(tmp)
                .then(() => {
                    return db.purge(tmp);
                })
                .then(function() {
                    // TODO confirm that all tables have been dropped
                    done();
                })
                .catch((err) => fail(err));
        }, 10000);
    });

});
