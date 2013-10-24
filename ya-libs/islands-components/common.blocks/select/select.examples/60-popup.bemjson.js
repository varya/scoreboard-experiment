({
    block: 'b-page',
    title: 'В попапе',
    head: [
        { elem: 'css', url: '_60-popup.css', ie: false },
        { elem: 'css', url: '_60-popup', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content:
            [
                {
                    block: 'b-link',
                    mods: { pseudo: 'yes', 'is-bem': 'yes' },
                    content: 'Кликать сюда'
                },
                {
                    block: 'popup',
                    content:[
                    {
                       elem: 'tail'
                    },
                    {
                        elem: 'content',
                        content: {
                            block: 'select',
                            name: 'mail',
                            mods: { size: 'm', theme: 'normal' },
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
                                            attrs: { value: 'draft' },
                                            content: 'Черновики'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'inbox' },
                                            content: 'Входящие'
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
                    }]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_60-popup.js' }
    ]
})
