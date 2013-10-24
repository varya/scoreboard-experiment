({
    block: 'b-page',
    title: '46without-fade-in-out',
    head: [

        { elem: 'css', url: '_46-without-fade-in-out.css', ie: false },
        { elem: 'css', url: '_46-without-fade-in-out', ie: true }

    ],

    content: [
        {

            block: 'example',
            js: true,

            content: [
                {
                    block: 'example-section',
                    content: [

                        {
                            tag: 'p',
                            content: 'У этого варианта popup нет анимации скрытия'
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
                            mods: { 'fade-out': 'no', adaptive: 'yes' },

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

                {
                    block: 'example-section',
                    content: [

                        {
                            tag: 'p',
                            content: 'У этого варианта popup нет анимации появления'
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
                            mods: { 'fade-in': 'no', adaptive: 'yes' },

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
                }
            ]
        },

        { block: 'i-jquery', mods: { version: '1.8.3' } },
        { elem: 'js', url:'_46-without-fade-in-out.js' }

    ]
})
