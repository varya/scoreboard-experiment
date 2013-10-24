({
    block: 'b-page',
    title: 'API',
    head: [
        { elem: 'css', url: '_50-api.css', ie: false },
        { elem: 'css', url: '_50-api', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: {
                tag: 'table',
                content: {
                    tag: 'tr',
                    content: [
                        {
                            tag: 'td',
                            attrs: { style: 'width:30%' },
                            content: {
                                block: 'select',
                                name: 'country',
                                mods: { size: 'm', theme: 'normal' },
                                js: { rows: 12 },
                                content: [
                                {
                                    block: 'button',
                                    content: 'США'
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
                                        attrs: { value: 'us', selected: 'selected' },
                                        content: 'США'
                                    },
                                    {
                                        elem: 'option-group',
                                        attrs: { label: 'СНГ' },
                                        content: [
                                        {
                                            elem: 'option',
                                            attrs: { value: 'ua' },
                                            content: 'Украина'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'be' },
                                            content: 'Беларуссия'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'kz' },
                                            content: 'Казахстан'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'ar' },
                                            content: 'Армения'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'az' },
                                            content: 'Азербайджан'
                                        }
                                        ]
                                    },
                                    {
                                        elem: 'option-group',
                                        attrs: { label: 'Европа' },
                                        content: [
                                        {
                                            elem: 'option',
                                            attrs: { value: 'uk' },
                                            content: 'Англия'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'de' },
                                            content: 'Германия'
                                        },
                                        {
                                            elem: 'option',
                                            attrs: { value: 'fr' },
                                            content: 'Франция'
                                        }
                                        ]
                                    },
                                    {
                                        elem: 'option',
                                        attrs: { value: 'jp' },
                                        content: 'Япония'
                                    }
                                    ]
                                }
                                ]
                            }
                        },
                        {
                            tag: 'td',
                            attrs: { style: 'padding:10px 0 0 70px' },
                            content: {
                                tag: 'pre',
                                elem: 'code',
                                content: [
                                    "$('.select).bem('select')",
                                    ".on('change', function(e, data) {",
                                    { tag: 'br' },
                                    "   this.val() ",
                                    { tag: 'samp', attrs: { id: 'val' }},
                                    { tag: 'br' },
                                    "   data.index: ",
                                    { tag: 'samp', attrs: { id: 'index' }},
                                    { tag: 'br' },
                                    "})",
                                    { tag: 'br' },
                                    {
                                        block: 'b-link',
                                        mods: { pseudo: 'yes' },
                                        js: { val: 'uk' },
                                        content: ".val('uk')"
                                    },
                                    {
                                        block: 'b-link',
                                        mods: { pseudo: 'yes' },
                                        js: { val: 'some-unknowen-val' },
                                        content: ".val('some-unknowen-val')"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_50-api.js' }
    ]
})
