const Embeds = require('../../embeds.js');
const {getAllExamples} = require('../../docs.js');

const cleanTitle = title =>
    title
        .replace(/^#+\s?/, '')
        .replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)');

const imagePattern = /!\[(?<title>[^\r\n]*?)\]\((?<link>[\s\S]+?)\)/g

module.exports = {
    name: 'example',
    description: 'View examples by keyword.',
    run: async function(message, args) {
        const examples = await getAllExamples();
        if (!args || !args.length) {
            message.channel.send(Embeds.info(
                'AQUA',
                `We have ${examples.length} examples in total`,
                'Add a keyword after the command to filter them',
                'Example: `ct!example module`'
            ));
            return;
        }
        const query = args.join(' ').toLowerCase();
        const results = [];
        for (const example of examples) {
            if (example.title.toLowerCase().indexOf(query) !== -1 ||
                example.definition.toLowerCase().indexOf(query) !== -1 ||
                example.pageTitle.toLowerCase().indexOf(query) !== -1
            ) {
                const noImagesLines = example.lines.replace(imagePattern, '(See image below, $1)');
                results.push({
                    name: `${cleanTitle(example.title)} at ${cleanTitle(example.pageTitle)} -> ${cleanTitle(example.definition)}`,
                    value: noImagesLines,
                    sourceLines: example.lines,
                    url: `${example.url}#${example.hash}`,
                });
            }
        }
        if (!results.length) {
            message.channel.send({
                embed: {
                    color: 'RED',
                    title: 'Nothing found :c'
                }
            });
            return;
        }
        for (const result of results) {
            const images = result.sourceLines.matchAll(imagePattern);
            message.channel.send({
                content: `**${result.name}** (from ${result.url})\n\n${result.value}`
            });

            if (images) for (const image of images) {
                const embed = {
                    color: 'AQUA',
                    title: image.groups.title || 'Attached image',
                    image: {
                        url: `https://raw.githubusercontent.com/ct-js/docs.ctjs.rocks/master/docs/${image.groups.link.slice(2)}`
                    }
                };
                message.channel.send({
                    embed
                });
            }
        }
    }
};
