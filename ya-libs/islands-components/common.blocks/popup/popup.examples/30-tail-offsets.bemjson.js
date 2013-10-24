({
    block: 'b-page',
    title: '30tail-offsets',
    head: [
        { elem: 'css', url: '_30-tail-offsets.css', ie: false },
        { elem: 'css', url: '_30-tail-offsets', ie: true }
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
                            tail: {
                                offset: {
                                    left: 30
                                }
                            }
                        }
                    },

                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: 'Хвост этого попапа смещён вправо относительно центра owner.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_30-tail-offsets.js' }
    ]
})
