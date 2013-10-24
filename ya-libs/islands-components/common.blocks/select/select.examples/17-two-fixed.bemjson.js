({
    block: 'b-page',
    title: 'C разной фиксированной шириной в размерах',
    head: [
        { elem: 'css', url: '_17-two-fixed.css', ie: false },
        { elem: 'css', url: '_17-two-fixed', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: [
                {
                    block: 'select',
                    name: 'mail',
                    mods: { size: 's', theme: 'normal', width: '100' },
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
                                    content: 'ВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящие'
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
                                            content: 'National GeographicNational GeographicNational GeographicNational Geographic'
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
                },
                '&nbsp;&nbsp;',
                {
                    block: 'select',
                    name: 'mail2',
                    mods: { size: 'm', theme: 'normal', width: '400' },
                    content: [
                        {
                            block: 'button',
                            content: 'Звенящие'
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
                                    content: 'ВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящие'
                                },
                                {
                                    elem: 'option',
                                    attrs: { value: 'del' },
                                    content: 'Удаленные'
                                },
                                {
                                    elem: 'option',
                                    attrs: { value: 'ring', selected: 'selected' },
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
                                            content: 'National GeographicNational GeographicNational GeographicNational Geographic'
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
        { elem: 'js', url: '_17-two-fixed.js' }
    ]
})
