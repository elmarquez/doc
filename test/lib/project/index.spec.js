describe('lib / project', function() {

    describe('init', function() {
        describe('git repository', function() {
            it('initializes the Git repository', function() {
                fail();
            });
            it('fails if the path does not exist', function() {
                fail();
            });
        });
        describe('default files', function() {
            it('creates default project.json', function() {
                fail();
            });
            it('creates default .gitignore', function() {
                fail();
            });
        });
    });

    describe('readProjectJson', function() {
        it('returns a JavaScript object if the file is found and the data is parsed successfully', function() {
           expect(1).to.equal(-1);
        });
        it('fails if the file can not be found', function() {
            expect(1).to.equal(-1);
        });
        it('fails if the file can not be parsed', function() {
            expect(1).to.equal(-1);
        });
    });

});
