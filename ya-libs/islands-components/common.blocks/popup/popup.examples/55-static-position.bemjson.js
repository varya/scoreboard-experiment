({
    block: 'b-page',
    title: '55static-position',
    head: [
        { elem: 'css', url: '_55-static-position.css', ie: false },
        { elem: 'css', url: '_55-static-position', ie: true }
    ],

    content: [

        {

            block: 'example',
            js: true,

            content: [

                {

                    block: 'popup',
                    attrs: { style: 'width:200px' },
                    mods: { adaptive: 'yes', autoclosable: 'no' },
                    /*
                     * Почему bottom-left?
                     * Потому что если попросить блок расположиться по умолчанию(bottom-center)
                     * То он расположит центр верхней границы в точке left
                     * указанных координат
                     * Иными словами точка это как невидимый owner размером 1x1
                     */
                    js: {
                        directions: 'bottom-left'
                    },


                    content: [
                        {
                            elem: 'content',
                            content: 'Душа моя озарена неземной радостью, как эти чудесные весенние утра, которыми я наслаждаюсь от всего сердца. Я совсем один и блаженствую в здешнем краю, словно созданном для таких, как я. Я так счастлив, мой друг, так упоен ощущением покоя, что искусство мое страдает от этого.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_55-static-position.js' }

    ]
})
