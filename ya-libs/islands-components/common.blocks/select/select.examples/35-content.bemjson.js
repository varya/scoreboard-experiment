({
    block: 'b-page',
    title: 'Шириной 100%',
    head: [
        { elem: 'css', url: '_35-content.css', ie: false },
        { elem: 'css', url: '_35-content', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: [
                {
                        block: 'select',
                        name: 'mail',
                        mods: { size: 'm', layout: 'content', theme: 'normal' },
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
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_35-content.js' }
    ]
})
