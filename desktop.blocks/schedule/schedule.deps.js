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
                block: 'i-bem'
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
                block: 'backbone'
            },
            {
                block: 'router'
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
            },
            {
                block: 'initializer'
            }
        ]
    }
])
