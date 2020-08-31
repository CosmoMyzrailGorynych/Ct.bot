const shell = require('shelljs');
const p = require('path');
const fs = require('fs');
const logger = require('./index.js').logger;

const jdown = require('jdown');

const docrepo = 'https://github.com/ct-js/docs.ctjs.rocks.git';
const docpath = 'ctjs_docs';
const docContent = jdown(docpath, {parseMd: false});

module.exports = {
    clone() {
        // Clone repo
        shell.cd(__dirname);

        // Have we already cloned the repo?
        if (!fs.existsSync(docpath)) {
            try {
                shell.exec(`git clone ${docrepo} ctjs_docs`);
            } catch (err) {
                // Whoops something bad happened
                logger.warn('There was an error retrieving the documentation from ' + docrepo);
            }
        } else {
            // Update the repo
            shell.cd(p.join(__dirname, docpath));
            shell.exec('git fetch origin master');
            shell.exec('git pull origin master');
        }
    },
    query(docs, term) {
        // TODO: Get documentation based off term
    },
    getTopics(docs) {
        // TODO: Get all topics and return an array
    },
    docs: docContent
};
