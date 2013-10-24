({
    block: 'b-page',
    title: 'В попапе с position: fixed',
    head: [
        { elem: 'css', url: '_65-popup-fixed.css', ie: false },
        { elem: 'css', url: '_65-popup-fixed', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: [
                {
                    block: 'b-link',
                    mods: { pseudo: 'yes', 'is-bem': 'yes' },
                    content: 'Кликать сюда'
                },
                {
                    block: 'popup',
                    mods: { theme: 'ffffff', direction: 'fixed' },
                    js: { underMods: { type: 'paranja', color: 'white' } },
                    content: [
                        { elem: 'tail' },
                        {
                            elem: 'content',
                            content: {
                                block: 'select',
                                mods: { size: 'm', theme: 'normal' },
                                name: 'mail',
                                content: [
                                    {
                                        block: 'button',
                                        content: 'Отправленные'
                                    },
                                    {
                                        elem: 'control',
                                        content: [
                                            {
                                                elem: 'option',
                                                attrs: { value: 'send' },
                                                content: 'Отправленные'
                                            },
                                            {
                                                elem: 'option',
                                                attrs: { value: 'del' },
                                                content: 'Удаленные'
                                            },
                                            {
                                                elem: 'option',
                                                attrs: { value: 'ring' },
                                                content: 'Звенящие'
                                            },
                                            {
                                                elem: 'option-group',
                                                attrs: { label: 'Опшен груп' },
                                                content: [
                                                    {
                                                        elem: 'option',
                                                        attrs: { value: 'tvc' },
                                                        content: 'ТВЦ'
                                                    },
                                                    {
                                                        elem: 'option',
                                                        attrs: { value: 'ng' },
                                                        content: 'National Geographic'
                                                    }
                                                ]
                                            },
                                            {
                                                elem: 'option-group',
                                                attrs: { label: 'Еще группа' },
                                                content: [
                                                    {
                                                        elem: 'option',
                                                        attrs: { value: 'poisoned' },
                                                        content: 'Отравленные'
                                                    },
                                                    {
                                                        elem: 'option',
                                                        attrs: { value: 'exploded' },
                                                        content: 'Взорванные'
                                                    }
                                                ]
                                            },
                                            {
                                                elem: 'option',
                                                attrs: { value: 'unknown' },
                                                content: 'Непознанные'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    block: 'b-block',
                    content: 'Еще Аристотель в своей «Политике» говорил, что музыка, воздействуя на человека, доставляет «своего рода очищение, то есть облегчение, связанное с наслаждением», однако детройтское техно косвенно. Асинхронное ритмическое поле, в первом приближении, синхронно имеет дискретный хамбакер, благодаря употреблению микромотивов (нередко из одного звука, а также двух-трех с паузами). Аллегро, на первый взгляд, многопланово дает микрохроматический интервал, таким образом конструктивное состояние всей музыкальной ткани или какой-либо из составляющих ее субструктур (в том числе: временнoй, гармонической, динамической, тембровой, темповой) возникает как следствие их выстраивания на основе определенного ряда (модуса). Мономерная остинатная педаль вызывает деструктивный эффект "вау-вау", о чем подробно говорится в книге М.Друскина "Ганс Эйслер и рабочее музыкальное движение в Германии". Асинхронное ритмическое поле дает модальный сет, благодаря широким мелодическим скачкам. Эффект "вау-вау", по определению, представляет собой позиционный аккорд, благодаря употреблению микромотивов (нередко из одного звука, а также двух-трех с паузами). '
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_65-popup-fixed.js' }
    ]
})
