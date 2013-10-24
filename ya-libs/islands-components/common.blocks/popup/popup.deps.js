({
    mustDeps: [
        { block: 'i-jquery', elems: 'leftclick' },
        { block: 'i-bem', elems: ['dom', 'html'], mods: { 'init': 'auto' } }
    ],
    shouldDeps: [

        {
            elems: [ 'shadow', 'wrap', 'content' ],
            mods: {
                'theme': 'ffffff',
                'visibility': 'visible',
                'autoclosable': 'yes',
                'adaptive': 'yes'
            }
        },

        {
            mods: {
                'visibility': 'outside',
                'animate': 'yes'
            }
        },

        {
            elem: 'under',
            mods: {
                'color': 'white',
                'type': 'paranja'
            }
        }

    ]
})
