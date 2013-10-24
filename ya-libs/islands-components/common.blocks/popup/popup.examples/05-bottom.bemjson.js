({
    block: 'b-page',
    title: '05bottom',
    head: [

        { elem: 'css', url: '_05-bottom.css', ie: false },
        { elem: 'css', url: '_05-bottom', ie: true }
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
                    /*
                     * Можно обойтись без указания направлений
                     * Раскрытие вниз производится по умолчанию
                     * см islands-popups/common.blocks/popup/popup.js:30
                     */
                    js: {
                        directions: 'bottom'
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
        { elem: 'js', url:'_05-bottom.js'  }
    ]
})
