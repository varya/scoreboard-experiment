({
    block: 'b-page',
    title: 'Динамически перестраиваемые селекты (2)',
    head: [
        { elem: 'css', url: '_55-dynamic.css', ie: false },
        { elem: 'css', url: '_55-dynamic', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: {
                block: 'b-form',
                attrs: { action: '#!/' },
                content: [
                    {
                        tag: 'span',
                        attrs: { style: 'font-size: 15px; '},
                        content: 'Страна:&nbsp;&nbsp;'
                    },
                    {
                        block: 'select',
                        name: 'country',
                        mods: { size: 's', theme: 'normal' },
                        content: [
                            {
                                block: 'button',
                                content: 'Россия'
                            },
                            {
                                elem: 'control',
                                content: [
                                    {
                                        elem: 'option',
                                        attrs: { value: 'ru' },
                                        content: 'Россия'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'ua' },
                                        content: 'Украина'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'be' },
                                        content: 'Беларусь'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'span',
                        attrs: { style: 'font-size: 13px; margin-left: 1em;'},
                        content: 'город:&nbsp;&nbsp;'
                    },
                    {
                        block: 'select',
                        name: 'city',
                        mods: { size: 'm', theme: 'normal' },
                        content: [
                            {
                                block: 'button',
                                content: '-'
                            },
                            {
                                elem: 'control',
                                content: [
                                    {
                                        elem: 'option',
                                        attrs: { value: 'ru' },
                                        content: '-'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_55-dynamic.js' }
    ]
})
