({
    block: 'b-page',
    title: 'Ссылкой',
    head: [
        { elem: 'css', url: '_30-link.css', ie: false },
        { elem: 'css', url: '_30-link', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: {
                block: 'button',
                mods: { size: 'm' },
                url: '#',
                content: 'Я.Ссылка'
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_30-link.js' }
    ]
})
