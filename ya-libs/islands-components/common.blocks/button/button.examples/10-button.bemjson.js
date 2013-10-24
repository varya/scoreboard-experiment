({
    block: 'b-page',
    title: 'Простая кнопка',
    head: [
        { elem: 'css', url: '_10-button.css', ie: false },
        { elem: 'css', url: '_10-button', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: [
                {
                    tag: 'form',
                    attrs: { action: 'bbb' },
                    content: [
                        {
                            block: 'button',
                            mods: { size: 'm' },
                            content: 'Я.Button'
                        }
                    ]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_10-button.js' }
    ]
})
