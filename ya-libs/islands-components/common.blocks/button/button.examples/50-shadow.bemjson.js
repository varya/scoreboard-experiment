({
    block: 'b-page',
    title: 'С тенью',
    head: [
        { elem: 'css', url: '_50-shadow.css', ie: false },
        { elem: 'css', url: '_50-shadow', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: [
                {
                    block: 'button',
                    mods: {  size: 'm', shadow: 'yes' },
                    content: '_theme_normal && _shadow_yes'
                },
                '&nbsp;&nbsp;',
                {
                    block: 'button',
                    mods: { theme: 'action', size: 'm', shadow: 'yes' },
                    type: 'submit',
                    content: '_theme_action && _shadow_yes'
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_50-shadow.js' }
    ]
})
