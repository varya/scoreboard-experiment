({
    block: 'b-page',
    title: 'Кнопки с _theme_dark-grey',
    head: [
        { elem: 'css', url: '_110-theme-dark-grey.css', ie: false },
        { elem: 'css', url: '_110-theme-dark-grey', ie: true }
    ],
    content: [
        {
            attrs: { style: 'padding: 20px; background: #393837;' },
            content: [
                {
                    block: 'button',
                    mods: { size: 's', theme: 'dark-grey' },
                    content: 'Я.Button'
                },
                '&nbsp;&nbsp;',
                {
                    block: 'button',
                    mods: { size: 'm', theme: 'dark-grey' },
                    content: 'Я.Button'
                },
                '<br><br>',
                {
                    block: 'button',
                    attrs: { id: 'ya_link' },
                    mods: { size: 's', theme: 'dark-grey' },
                    url: '#',
                    content: 'Я.Ссылка'
                },
                '&nbsp;&nbsp;',
                {
                    block: 'button',
                    attrs: { id: 'ya_link' },
                    mods: { size: 'm', theme: 'dark-grey' },
                    url: '#',
                    content: 'Я.Ссылка'
                },
                '<br><br>',
                {
                    block: 'button',
                    mods: { size: 's', theme: 'dark-grey', disabled: 'yes' },
                    content: 'Я.Button'
                },
                '&nbsp;&nbsp;',
                {
                    block: 'button',
                    mods: { size: 'm', theme: 'dark-grey', disabled: 'yes' },
                    content: 'Я.Button'
                },
                '<br><br>',
                {
                    block: 'button',
                    attrs: { id: 'ya_link' },
                    mods: { size: 's', theme: 'dark-grey', disabled: 'yes' },
                    url: '#',
                    content: 'Я.Ссылка'
                },
                '&nbsp;&nbsp;',
                {
                    block: 'button',
                    attrs: { id: 'ya_link' },
                    mods: { size: 'm', theme: 'dark-grey', disabled: 'yes' },
                    url: '#',
                    content: 'Я.Ссылка'
                }
            ]

        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_110-theme-dark-grey.js' }
    ]
})
