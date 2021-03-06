({
    block: 'b-page',
    title: 'С float',
    head: [
        { elem: 'css', url: '_60-link-float.css', ie: false },
        { elem: 'css', url: '_60-link-float', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: {
                block: 'b-form',
                url: '#',
                content: {
                    tag: 'table',
                    cls: 'b-form__table',
                    attrs: { cellpadding: 0, cellspacing: 0 },
                    content: {
                        tag: 'tr',
                        content: [
                            {
                                tag: 'td',
                                attrs: { style: 'background: #9acd32;' },
                                content: [
                                    {
                                        block: 'button',
                                        mods: { 'float': 'right', theme: 'normal', size: 'm' },
                                        url: '#',
                                        content: 'Ссылка float right'
                                    },
                                    {
                                        tag: 'p',
                                        content: 'Люблю грозу в начале мая, когда весенний, первый гром как бы резвяся и играя, грохочет в небе голубом. Гремят раскаты молодые, вот дождик брызнул, пыль летит, повисли перлы дождевые и солнце нити золотит. С горы бежит поток проворный, в лесу не молкнет птичий гам. И гам лесной, и шум нагорный - все вторит весело громам.'
                                    }
                                ]
                            },
                            {
                                tag: 'td',
                                attrs: { style: 'background: #6495ed;' },
                                content: [
                                    {
                                        block: 'button',
                                        mods: { 'float': 'left', size: 'm' },
                                        content: 'Button float left'
                                    },
                                    {
                                        tag: 'p',
                                        content: 'Люблю грозу в начале мая, когда весенний, первый гром как бы резвяся и играя, грохочет в небе голубом. Гремят раскаты молодые, вот дождик брызнул, пыль летит, повисли перлы дождевые и солнце нити золотит. С горы бежит поток проворный, в лесу не молкнет птичий гам. И гам лесной, и шум нагорный - все вторит весело громам.'
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_60-link-float.js' }
    ]
})
