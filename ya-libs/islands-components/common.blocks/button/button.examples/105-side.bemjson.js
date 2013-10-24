({
    block: 'b-page',
    title: 'Кнопки с незакругленными краями',
    head: [
        { elem: 'css', url: '_105-side.css', ie: false },
        { elem: 'css', url: '_105-side', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px;' },
            content: [
                {
                    tag: 'form',
                    attrs: { action: 'bbb' },
                    content: [
                        {
                            block: 'button',
                            mods: { size: 'm', side: 'left' },
                            content: 'side: left'
                        },
                        {
                            block: 'button',
                            mods: { size: 'm', side: 'right' },
                            content: 'side: right'
                        }
                    ]
                },
                '<br>',
                {
                    tag: 'form',
                    attrs: { action: 'bbb' },
                    content: [
                        {
                            block: 'button',
                            mods: { size: 'm', side: 'left', theme: 'action' },
                            content: 'side: left'
                        },
                        {
                            block: 'button',
                            mods: { size: 'm', side: 'right', theme: 'action' },
                            content: 'side: right'
                        }
                    ]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_105-side.js' }
    ]
})
