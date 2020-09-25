const constants = require('../../lib/constants');
const fs = require('fs');
const lib = require('../../lib/library');
const path = require('path');

describe('lib', function() {
    describe('library', function() {
        describe('info', function() {

        });
        describe('purge', function() {
            let dbpath = null;

            after(async function(done) {
                
            });

            before(async function(done) {

            });

            it('clears all contents from the database', function(done) {
                // FIXME partial test
                const cmd = {
                    path: fs.mkdtempSync() 
                };
                lib.purge(cmd)
                    .then(() => done())
                    .catch(err => fail);
            });
        });
        describe('update', function() {
            it('gets the list of all files in the directory', function() {
                fail();
            });
            it('gets the list of all files in the directory by extension', function() {
                fail();
            });
            it('gets the list of all files that have been deleted', function () {
                fail();
            });
            it('gets the list of all files that have changed content', function() {
                fail();
            });
            it('gets the list of all files that have changed location', function() {
                fail();
            });
            });
    });
});