({
    block: 'b-page',
    title: 'Динамически перестраиваемые селекты (1), проброс модификаторов блоку \'popup\' и элементу \'select__popup\'',
    head: [
        { elem: 'css', url: '_52-related.css', ie: false },
        { elem: 'css', url: '_52-related', ie: true }
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
                        mods: { size: 'm', theme: 'normal' },
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
                        mods: { size: 's', theme: 'normal' },
                        js: {
                            // пробрасываем модификатор блоку 'popup'
                            popupMods: { animate: 'yes' },
                            // пробрасываем модификатор элементу 'select__popup'
                            elemPopupMods: { 'hide-item-disabled': 'yes' }
                        },
                        content: [
                            {
                                block: 'button',
                                content: 'Москва'
                            },
                            {
                                elem: 'control',
                                content: [
                                    {
                                        elem: 'option',
                                        attrs: { value: 'msk' },
                                        content: 'Москва'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'spb' },
                                        content: 'Санкт-Петербург'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'krs' },
                                        content: 'Красноярск'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'simf' },
                                        content: 'Симферополь'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'sev' },
                                        content: 'Севастополь'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'krc' },
                                        content: 'Керчь'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'minsk' },
                                        content: 'Минск'
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'brest' },
                                        content: 'Брест'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_52-related.js' }
    ]
})
