([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'i-bem',
                elem: 'html',
                tech: 'bemhtml'
            },
            {
                block: 'popup',
                tech: 'bemhtml'
            }
        ]
    },
    {
        mustDeps: [
            { block: 'i-bem', elem: 'dom' },
            { block: 'button', mods: { 'arrow': 'down' } },
            { block: 'popup'}
        ],
        shouldDeps: [
            {
                elem: 'item',
                mods: {
                    'disabled': 'yes',
                    'focused': 'yes',
                    'hovered': 'yes',
                    'selected': 'yes',
                    'inner': 'yes',
                    'label': 'yes'
                }
            },
            {
                elems: [
                    'button',
                    'ui',
                    'control',
                    'list',
                    'separator',
                    'popup'
                ]
            }
        ]
    }
])
