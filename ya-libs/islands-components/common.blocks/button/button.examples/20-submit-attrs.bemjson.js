({
    block: 'b-page',
    title: 'Submit with attrs',
    head: [
        { elem: 'css', url: '_20-submit-attrs.css', ie: false },
        { elem: 'css', url: '_20-submit-attrs', ie: true }
    ],
    attrs: { style: 'padding: 20px;' },
    content: {
        tag: 'form',
        attrs: { action: '#' },
        content: [
            {
                block: 'button',
                mods: { theme: 'action', size: 'm' },
                type: 'submit',
                name: 'my-submit',
                content: 'Я.Submit'
            },
            { block: 'i-jquery', mods: { version: '1.8.3' }},
            { elem: 'js', url: '_20-submit-attrs.js' }
        ]
    }
})
