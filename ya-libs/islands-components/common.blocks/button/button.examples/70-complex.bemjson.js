({
    block: 'b-page',
    title: 'В тексте и таблице',
    head: [
        { elem: 'css', url: '_70-complex.css', ie: false },
        { elem: 'css', url: '_70-complex', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: {
                block: 'b-form',
                cls: 'my-form',
                url: '#',
                content: {
                    tag: 'table',
                    attrs: { cellpadding: 0, cellspacing: 0 },
                    content: [
                        {
                            tag: 'tr',
                            attrs: { style: 'background: #ee82ee;' },
                            content: [
                                {
                                    tag: 'td',
                                    attrs: { colspan: 3 },
                                    content: {
                                        tag: 'p',
                                        content: [
                                            'Для того, чтобы Яндекс выглядел аккуратнее и развивался в одном стиле, были разработаны декоративные (нестандартные для операционной системы) элементы. ' +
                                            'Одним из таких элементов является ',
                                            {
                                                block: 'button',
                                                mods: { size: 's' },
                                                url: '#',
                                                content: 'кнопка'
                                            },
                                            '. Данная кнопка предназначена только для работы с интерфейсами, она не подходит для промо-задач.'
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'tr',
                            attrs: { style: 'background: #6495ed;' },
                            content: [
                                {
                                    tag: 'td',
                                    attrs: { style: 'text-align: left; vertical-align: top;' },
                                    content: [
                                        {
                                            tag: 'span',
                                            content: 'Влево'
                                        },
                                        '&nbsp;&nbsp;',
                                        {
                                            block: 'button',
                                            mods: { size: 'm' },
                                            content: 'И вверх'
                                        }
                                    ]
                                },
                                {
                                    tag: 'td',
                                    attrs: { style: 'text-align: center; vertical-align: middle;' },
                                    content: [
                                        {
                                            block: 'button',
                                            mods: { size: 's' },
                                            content: 'По центру'
                                        },
                                        '&nbsp;&nbsp;',
                                        {
                                            block: 'button',
                                            mods: { theme: 'action', size: 'm' },
                                            type: 'submit',
                                            content: 'По центру'
                                        }
                                    ]
                                },
                                {
                                    tag: 'td',
                                    attrs: { style: 'text-align: right; vertical-align: bottom;' },
                                    content: [
                                        {
                                            block: 'button',
                                            mods: { size: 'm' },
                                            content: 'Вправо'
                                        },
                                        '&nbsp;&nbsp;',
                                        {
                                            tag: 'span',
                                            content: 'и вниз'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_70-complex.js' }
    ]
})
