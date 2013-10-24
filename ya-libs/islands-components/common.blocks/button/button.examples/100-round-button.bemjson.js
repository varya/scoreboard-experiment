({
    block: 'b-page',
    title: 'Круглая кнопка',
    head: [
        { elem: 'css', url: '_100-round-button.css', ie: false },
        { elem: 'css', url: '_100-round-button', ie: true }
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
                            mods: {
                                round: 'yes',
                                state: 'pause'
                            }
                        },
                        {
                            block: 'button',
                            mods: {
                                round: 'yes',
                                state: 'play'
                            }
                        },
                        {
                            block: 'button',
                            mods: {
                                round: 'yes',
                                state: 'radio'
                            }
                        }
                    ]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_100-round-button.js' }
    ]
})
