([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'select',
                elem: 'item',
                tech: 'bemhtml'
            }
        ]
    },
    {
        shouldDeps: {
            block: 'select',
            elem: 'popup',
            mods: { 'hide-item-disabled': 'yes' }
        }
    }
])
