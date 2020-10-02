const { expect } = require('chai');
const files = require('../../../lib/library/files');
const path = require('path');

describe('lib / library / files', function() {

    const fixtures = path.join(process.cwd(), 'test', 'fixtures');
    const state1 = path.join(fixtures, 'state1');
    const state2 = path.join(fixtures, 'state2');

    describe('exists', function() {
        it('returns true if the file exists and can be read', function(done) {
            const p = path.join(fixtures, 'state1', 'test1.md');
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
        it('returns false if the file does not exist or can not be read', function(done) {
            const p = path.join(fixtures, 'state1', 'does-not-exist.md');
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
    });

    xdescribe('getAddedFiles', function() {
        it('returns the list of new files', function() {
            fail();
        });
    });

    xdescribe('getCurrentFiles', function() {
        afterEach(function(done) {
            
        });
        beforeEach(function(done) {

        });
        it('returns the list of file paths, hashes in the current index', function() {
            fail();
        });
    });

    xdescribe('getDeletedFiles', function() {
        it('returns the list of deleted files', function() {
            fail();
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