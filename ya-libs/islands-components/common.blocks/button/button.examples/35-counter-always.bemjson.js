({
    block: 'b-page',
    title: 'С счетчиками',
    head: [
        { elem: 'css', url: '_35-counter-always.css', ie: false },
        { elem: 'css', url: '_35-counter-always', ie: true }
    ],
    content: [
        {
            block: 'b-form',
            attrs: { action: '#', method: 'get' },
            content: [
            {
                attrs: { style: 'margin: 20px 0 20px 20px;' },
                content: [
                    {
                        block: 'button',
                        mods: { size: 'm', counter: 'yes' },
                        counter: 123,
                        content: 'Я.Кнопка'
                    },
                    ' — со счётчиком с вероятностью показа по умолчанию'
                ]
            },
            {
                attrs: { style: 'margin: 20px 0 20px 20px;' },
                content: [
                    {
                        block: 'button',
                        type: 'submit',
                        mods: { theme: 'action', size: 'm',  counter: 'yes' },
                        counter: 123,
                        'show-counter': 50,
                        content: 'Я.Сабмит'
                    },
                    ' — у которой есть счётчик в половине случаев'
                ]
            },
            {
                attrs: { style: 'margin: 20px 0 20px 20px;' },
                content: [
                    {
                        block: 'button',
                        mods: { size: 'm', counter: 'yes' },
                        counter: 123,
                        'show-counter': 100,
                        url: '#',
                        content: 'Я.Ссылка'
                    },
                    ' — у которой всегда есть счётчик'
                ]
            }
        ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_35-counter-always.js' }
    ]
})
