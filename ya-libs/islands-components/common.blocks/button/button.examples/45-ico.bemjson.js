({
    block: 'b-page',
    title: 'Кнопки-ссылки с иконками',
    head: [
        { elem: 'css', url: '_45-ico.css', ie: false },
        { elem: 'css', url: '_45-ico', ie: true }
    ],
    content: {
        attrs: { style: 'margin: 20px' },
        content: [
            {
                tag: 'p',
                attrs: { style: 'font-size: 15px;' },
                content: [
                    'Только с иконками —&nbsp;',
                    {
                        block: 'button',
                        mods: { size: 's', 'only-icon': 'yes' },
                        content: [
                            {
                                block: 'b-icon',
                                mix: [{ block: 'button', elem: 'icon', mods: { '16': 'comment' } }],
                                alt: ''
                            }
                        ]
                    },
                    '&nbsp;&nbsp;',
                    {
                        block: 'button',
                        mods: { size: 'm', 'only-icon': 'yes' },
                        url: '#',
                        content: [
                            {
                                block: 'b-icon',
                                mix: [{ block: 'button', elem: 'icon', mods: { '16': 'comment' } }],
                                alt: ''
                            }
                        ]
                    }
                ]
            },
            {
                tag: 'p',
                attrs: { style: 'font-size: 15px;' },
                content: [
                    'С иконкой и текстом —&nbsp;',
                    {
                        block: 'button',
                        mods: { size: 'm' },
                        content: [
                            {
                                block: 'b-icon',
                                mix: [{ block: 'button', elem: 'icon',  mods: { '16': 'settings' } }],
                                alt: '/'
                            },
                            'Я.Кнопка'
                        ]
                    },
                    '&nbsp;&nbsp;',
                    {
                        block: 'button',
                        mods: { size: 'm' },
                        url: '#',
                        content: [
                            {
                                block: 'b-icon',
                                mix: [{ block: 'button', elem: 'icon',  mods: { '16': 'settings' } }],
                                alt: '/'
                            },
                            'Я.Cсылка'
                        ]
                    }
                ]
            },
            { block: 'i-jquery', mods: { version: '1.8.3' }},
            { elem: 'js', url: '_45-ico.js' }
        ]
    }
})
