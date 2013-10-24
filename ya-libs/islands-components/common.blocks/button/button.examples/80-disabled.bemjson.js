({
    block: 'b-page',
    title: 'Неактивные кнопки',
    head: [
        { elem: 'css', url: '_80-disabled.css', ie: false },
        { elem: 'css', url: '_80-disabled', ie: true }
    ],
    content: {
        attrs: { style: 'margin: 20px' },
        content: [
            {
                block: 'button',
                attrs: { id: 'ya_button' },
                tabindex: 1,
                mods: { size: 'm', disabled: 'yes' },
                content: 'Я.Button'
            },
            '&nbsp;&nbsp;',
            {
                block: 'button',
                attrs: { id: 'ya_submit' },
                mods: { theme: 'action', size: 'm', disabled: 'yes' },
                type: 'submit',
                content: 'Я.Submit'
            },
            '&nbsp;&nbsp;',
            {
                block: 'button',
                attrs: { id: 'ya_link' },
                mods: { size: 'm', disabled: 'yes' },
                url: '#',
                content: 'Я.Ссылка'
            },
            { block: 'i-jquery', mods: { version: '1.8.3' }},
            { elem: 'js', url: '_80-disabled.js' }
        ]
    }
})
