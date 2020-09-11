DOC, the research publication manager
=====================================

Discover, download, and share bibliographies and research content quickly, and
easily. Work as a team. Make your research reproducible with trivial effort.

This is a BETA release of the application and associated search infrastructure
for demonstration purposes.


## Dependencies

This project requires NodeJS 12 or greater to be available in the environment.

Install all application dependencies:

    npm install


## Install

Install the application in your local environment:

    install -g @elmarquez/doc

Once installed, you will be able 

    doc


## Test

Run command unit tests:

    npm test
    

## Release

Create a new release candidate, tag the repo:

    npm release

    
## Contributing

doc is a community driven, open source project. We accept pull requests for
new features and bug fixes. Please see the CODE_OF_CONDUCT.md file for rules
governing participation in the project.

    
## License

This project is made available under the MIT License. See the LICENSE file for
details.
A utility to index a collection of research documents and associated files. Librarian extracts and writes metadata to a local SqlLite database where it can be queried and examined by other tools.


## TODO Tasks

- extract words from PDF documents and store them in an inverted index
- identify files that have changed since the last run
- generate pdf, image thumbnails?
- tag documents
- export to JSON, YAML, etc. 
