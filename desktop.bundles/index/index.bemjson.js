({
    block: 'b-page',
    title: 'Title of the page',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index.ie.css', ie: 'gte IE 6' },
        { elem: 'meta', attrs: { name: 'description', content: '' }}
    ],
    content:[
        {
            block: 'schedule',
            js: {
                modelName: 'schedule'
            },
            content: [
                {
                    elem: 'title',
                    content: 'Super puper races'
                },
                {
                    elem: 'events',
                    mix: {
                        block: 'schedule',
                        elem: 'model-field'
                    }
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url: '_index.js' }
    ]
})
