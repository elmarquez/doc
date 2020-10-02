const constants = require('../../../lib/constants');
const db = require('../../../lib/library/database');
const fs = require('fs');
const files = require('../../../lib/library/files');
const path = require('path');

describe('lib / library / files', function() {

    const fixtures = path.join(process.cwd(), 'test', 'fixtures');

    xdescribe('exists', function() {
        it('returns true if the file exists and can be read', function() {
            fail();
        });
        it('returns false if the file does not exist or can not be read', function() {
            fail();
        });
    });

    xdescribe('getAddedFiles', function() {
        it('returns the list of new files', function() {
            fail();
        });
    });

    xdescribe('getCurrentFiles', function() {

        let state1 = path.join(fixtures, 'state1');
        let state2 = path.join(fixtures, 'state2');

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