({
    block: 'b-page',
    title: 'Со стрелкой',
    head: [
        { elem: 'css', url: '_95-with-arrow.css', ie: false },
        { elem: 'css', url: '_95-with-arrow', ie: true }
    ],
    content: [
        {
            block: 'b-form',
            attrs: { action: 'bbb' },
            content: [
                {
                    attrs: { style: 'margin: 20px 0 20px 20px;' },
                    content: {
                        block: 'button',
                        mods: { size: 's', arrow: 'down' },
                        content: 'Я.Кнопка размера S'
                    }
                },
                {
                    attrs: { style: 'margin: 20px 0 20px 20px;' },
                    content: {
                        block: 'button',
                        mods: { size: 'm', arrow: 'down' },
                        content: 'Я.Кнопка размера M'
                    }
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_95-with-arrow.js' }
    ]
})
