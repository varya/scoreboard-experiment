({
    block: 'b-page',
    title: 'Простая кнопка',
    head: [
        { elem: 'css', url: '_15-focus-no.css', ie: false },
        { elem: 'css', url: '_15-focus-no', ie: true }
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
                            mods: { size: 'm', focus: 'no' },
                            content: 'Я.Button'
                        }
                    ]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_15-focus-no.js' }
    ]
})
