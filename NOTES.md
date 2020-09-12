## TODO


## Command Modules

- Bibliography (bib)
    - Add
        - add DOI and URN values to records section
    - Get
        x download the example records
        - need to demonstrate both publications and datasets
        - need to distinguish types of things in records
    - Remove
    - Search
- Library (lib)
    - init
    - update all, single file
    - add
    - remove
    - search
- Project
    - init
    - run (script)
    - search, alias for library/search


https://arxiv.org/abs/1712.02734

* show cloning a project
* show retrieval of datasets
* split bibliography from resources
* support datapackage.json?
* add a resources.json or project.json?

* add support for semantic scholar
* add support for medical databases
* record citation into bib.json

* post presentation for research bazaar

* publish command? (make something public)
* doc content index
* collect statistics
* plugin architecture?


## Revisions

* Reimplement get/add on a per source basis
    x arxiv
    - dblp
    - plos
    - https://www.biorxiv.org/

* Revise error handling.
    - In most cases, we should terminate the command
    - Display error in red w an error code



## Planning

    - Need some idea about how to use existing services to do all of this work
    - How to monetize datasets if possible


## Identifiers

Ekron2017-research-publication
Ekron2017-some-title
Marques




## Conversions

    - Setup an online service to execute conversions? Then we don't have to reinvent the wheel
    and we might be able to capture some user data

    - https://bibtexparser.readthedocs.io/en/v0.6.2/
    - https://tex.stackexchange.com/questions/268294/convert-existing-bibtex-to-bibjson
    - https://github.com/zotero/translators
    - https://pandoc.org/
    - http://citationstyles.org/


## People to Talk To

    - jorge
    - resbaz
    - semantic scholar
    - arxiv
    - dblp
    - jstor
        - https://labs.jstor.org/developers/#showcase
    - gutenberg
    - etc.
    - https://www.mkonrad.net/about/
