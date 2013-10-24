({
    block: 'b-page',
    title: '10top',
    head: [
        { elem: 'css', url: '_10-top.css', ie: false },
        { elem: 'css', url: '_10-top', ie: true }
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
                        directions: 'top'
                    },

                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: 'Душа моя озарена неземной радостью, как эти чудесные весенние утра, которыми я наслаждаюсь от всего сердца. Я совсем один и блаженствую в здешнем краю, словно созданном для таких, как я. Я так счастлив, мой друг, так упоен ощущением покоя, что искусство мое страдает от этого.'
                        }
                    ]

                }

            ]
        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_10-top.js' }

    ]
})
