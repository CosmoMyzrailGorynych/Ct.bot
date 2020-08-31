const Embeds = require('../../embeds.js');

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    run(message, args) {
        message.client.docs.then((content) => console.log(JSON.stringify(content)))
    }
};
