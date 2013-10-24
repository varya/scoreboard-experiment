([
    {
        tech: 'js',
        mustDeps: [
            {
                block: 'schedule',
                tech: 'bemhtml'
            }
        ]
    },
    {
        mustDeps: [
            {
                block: 'i-bem',
                elem: 'html'
            },
            {
                block: 'i-model'
            },
            {
                block: 'i-glue'
            },
            {
                elem: 'dataprovider'
            },
            {
                block: 'i-location'
            }
        ],
        shouldDeps: [
            {
                block: 'select',
                mods: { size: ['m'], theme: ['normal'] },
                elems: ['control']
            },
            {
                block: 'button'
            }
        ]
    }
])
