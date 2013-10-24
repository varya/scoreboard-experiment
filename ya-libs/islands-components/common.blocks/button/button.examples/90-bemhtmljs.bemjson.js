({
    block: 'b-page',
    title: 'Сгенеренные на клиенте',
    head: [
        { elem: 'css', url: '_90-bemhtmljs.css', ie: false },
        { elem: 'css', url: '_90-bemhtmljs', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_90-bemhtmljs.js' }
    ]
})
