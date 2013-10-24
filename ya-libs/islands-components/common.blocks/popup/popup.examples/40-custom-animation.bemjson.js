({
    block: 'b-page',
    title: '40custom-animation',
    head: [
        { elem: 'css', url: '_40-custom-animation.css', ie: false },
        { elem: 'css', url: '_40-custom-animation', ie: true }
    ],

    content: [

        {

            block: 'example',
            js: true,

            content: [

                {
                    tag: 'p',
                    content: 'У этого варианта popup кастомная анимация'
                },

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
                        directions: 'bottom'
                    },

                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана. Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_40-custom-animation.js' }

    ]
})
