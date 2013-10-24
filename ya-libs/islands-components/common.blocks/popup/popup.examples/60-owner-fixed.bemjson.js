({
    block: 'b-page',
    title: '60owner-fixed',
    head: [
        { elem: 'css', url: '_60-owner-fixed.css', ie: false },
        { elem: 'css', url: '_60-owner-fixed', ie: true }
    ],

    content: [

        {
            block: 'example',
            js: true,

            content: [

                {
                    tag: 'p',
                    content: 'Стоит уменьшить высоту окна браузера чтобы появилась полоса прокрутки'
                },

                {
                    block: 'button',
                    mix: { block: 'owner' },
                    mods: { size: 'm' },
                    content: 'Я.Owner с position: fixed'
                },

                {
                    block: 'popup',
                    js: { directions: 'right-bottom' },
                    mods: {
                        'watch-scroll': 'no',
                        position: 'fixed'
                    },
                    content: [

                        { elem: 'tail' },
                        {
                            elem: 'content',
                            attrs: { style: 'width: 450px' },
                            content: 'Душа моя озарена неземной радостью, как эти чудесные весенние утра, которыми я наслаждаюсь от всего сердца. Я совсем один и блаженствую в здешнем краю, словно созданном для таких, как я.'
                        }

                    ]
                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_60-owner-fixed.js' }

    ]
})
