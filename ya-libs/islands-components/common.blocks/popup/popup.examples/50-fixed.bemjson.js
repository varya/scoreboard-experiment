({
    block: 'b-page',
    title: '50fixed',
    head: [
        { elem: 'css', url: '_50-fixed.css', ie: false },
        { elem: 'css', url: '_50-fixed', ie: true }
    ],

    content: [

        {

            block: 'example',
            js: true,

            content: [

                {
                    block: 'button',
                    mods: { size: 'm' },
                    content: 'Показать popup'
                },

                {

                    block: 'popup',
                    attrs: { style: 'width:400px' },
                    mods: {
                        type: 'modal',
                        position: 'fixed',
                        'has-close': 'yes'
                    },
                    underMods: { type: 'paranja' },

                    content: [
                        {
                            elem: 'content',
                            content: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана. Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами.'
                        }
                    ]

                }

            ]

        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_50-fixed.js' }

    ]
})
