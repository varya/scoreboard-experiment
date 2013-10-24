({
    block: 'b-page',
    title: '25offsets',
    head: [
        { elem: 'css', url: '_25-offsets.css', ie: false },
        { elem: 'css', url: '_25-offsets', ie: true }
    ],

    content: [
        {

            block: 'example',
            js: true,

            content: [

                {
                    block: 'button',
                    mods: { size: 'm' },
                    mix: [ { block: 'owner' } ],
                    content: 'Я.Owner'
                },

                {

                    block: 'popup',
                    attrs: { style: 'width:200px' },
                    mods: { adaptive: 'yes' },

                    js: {
                        directions: {
                            to: 'bottom',
                            offset: {
                                top: -10
                            }
                        }
                    },

                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: 'Этот попап смещён вверх отрицательным offset`ом в js-параметрах.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_25-offsets.js' }
    ]
})
