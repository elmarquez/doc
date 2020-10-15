const Promise = require('bluebird');
const { expect } = require('chai');
const constants = require('../../../lib/constants');
const db = require('../../../lib/library/database');
const files = require('../../../lib/library/files');
const fs = require('fs');
const fsutils = require('nodejs-fs-utils');
const lib = require('../../../lib/library');
const os = require('os');
const { join, sep } = require('path');
const { copyDir, walk } = require('../../../lib/utils');

describe('lib / library / files', function() {

    const fixtures = join(process.cwd(), 'test', 'fixtures');
    const state1 = join(fixtures, 'state1');
    const state2 = join(fixtures, 'state2');

    describe('exists', function() {
        it('returns true if the file exists and can be read', function(done) {
            const p = join(fixtures, 'state1', 'test1.pdf');
            files
                .exists(p)
                .then(function (e) {
                    expect(e).to.be.true;
                    done();
                })
                .catch(function (err) {
                    fail(err);
                });
        });
        it('returns false if the file does not exist', function(done) {
            const p = join(fixtures, 'state1', 'does-not-exist.md');
            files
                .exists(p)
                .then(function (e) {
                    expect(e).to.be.false;
                    done();
                })
                .catch(function (err) {
                    fail(err);
                });
        });
        xit('returns false if the file can not be read', function(done) {
            fail();
        });
    });

    xdescribe('getAddedFiles', function() {
        let tmp = null;
        beforeEach(function(done) {
            fs.mkdtemp(`${os.tmpdir()}${sep}test-`, function(err, dtemp) {
                if (err) throw new Error(err);
                tmp = dtemp;
                done();
            });
        });
        it('returns the list of new files', function(done) {
            const cfg = {
                path: tmp,
                database: join(tmp, constants.DEFAULT_DATABASE_FILENAME)
            };
            lib
                .update(cfg)
                .then(function(stats) {
                    expect(stats.count).to.equal(0);
                    return copyDir(state1, tmp);
                })
                .then(function() {
                    return lib.update(cfg);
                })
                .then(function(stats) {
                    expect(stats.added).to.equal(3);
                    expect(stats.count).to.equal(3);
                    done();
                })
                .catch(function(err) {
                    fail(err);
                });
        }, 10000);
    });

    describe('getCurrentFiles', function() {

        const result = [
            { path: '/library/file1.pdf', hash: '1' },
            { path: '/library/file2.pdf', hash: '2' },
            { path: '/library/file3.pdf', hash: '3' },
        ];

        beforeEach(function() {
            spyOn(db, 'getDocumentIdentifiers').and.returnValue(Promise.resolve(result));
        });

        it('returns the list of file paths, hashes in the current index', function(done) {
            files
                .getCurrentFiles('/path/to/library')
                .then(function(arr) {
                    expect(arr).to.deep.equal(result);
                    done();
                })
                .catch(function(err) {
                    fail(err);
                });
        });
    });

    describe('getDeletedFiles', function() {

        const afterState = [
            { path: '/test3.pdf', hash: '1' }
        ];
        const beforeState = [
            { path: '/test1.pdf', hash: '1' },
            { path: '/test2.pdf', hash: '1' },
            { path: '/test3.pdf', hash: '1' }
        ];
        let tmp = null;

        beforeEach(function(done) {
            spyOn(db, 'getDocumentIdentifiers').and.returnValue(Promise.resolve(beforeState));
            fs.mkdtemp(`${os.tmpdir()}${sep}test-`, function(err, dtemp) {
                if (err) throw new Error(err);
                tmp = dtemp;
                copyDir(state2, tmp).then(() => done()).catch((err) => fail(err));
            });
        });

        it('returns the list of deleted files', function(done) {
            files
                .getDeletedFiles(tmp)
                .then(function(deletedFiles) {
                    expect(deletedFiles).to.deep.equal(afterState);
                    done();
                })
                .catch(function(err) {
                    console.error(err);
                    fail(err);
                });
        });
    });

    xdescribe('getFiles', function() {
        it('get the list of files in a directory', function() {
            fail();
        });
    });

    xdescribe('getUpdatedFiles', function() {
        it('get the list of files that have chnaged', function() {
            fail();
        });
    });

});