({
    block: 'b-page',
    title: '35adaptive',
    head: [
        { elem: 'css', url: '_35-adaptive.css', ie: false },
        { elem: 'css', url: '_35-adaptive', ie: true }
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
                    attrs: { style: 'width:300px' },
                    mods: { adaptive: 'yes' },

                    /**
                     * Блок будет перестраивать себя только в указанных directions
                     */
                    js: {
                        directions: [ 'right', 'bottom', 'top' ]
                    },

                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: 'Проснувшись однажды утром после беспокойного сна, Грегор Замза обнаружил, что он у себя в постели превратился в страшное насекомое. Лежа на панцирнотвердой спине, он видел, стоило ему приподнять голову, свой коричневый, выпуклый, разделенный дугообразными чешуйками живот, на верхушке которого еле держалось готовое вот-вот окончательно сползти одеяло.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_35-adaptive.js' }

    ]
})
