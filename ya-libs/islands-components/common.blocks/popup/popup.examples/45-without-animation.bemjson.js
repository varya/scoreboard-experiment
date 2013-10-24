({
    block: 'b-page',
    title: '45without-animation',
    head: [
        { elem: 'css', url: '_45-without-animation.css', ie: false },
        { elem: 'css', url: '_45-without-animation', ie: true }
    ],

    content: [

        {

            block: 'example',
            js: true,

            content: [

                {
                    tag: 'p',
                    content: 'У этого варианта popup нет анимации'
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
                    mods: { animate: 'no', adaptive: 'yes' },

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
        { elem: 'js', url:'_45-without-animation.js' }

    ]
})
