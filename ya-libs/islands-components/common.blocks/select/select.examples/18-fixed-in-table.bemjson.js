({
    block: 'b-page',
    title: 'C фиксированной шириной в таблице',
    head: [
        { elem: 'css', url: '_18-fixed-in-table.css', ie: false },
        { elem: 'css', url: '_18-fixed-in-table', ie: true }
    ],
    content: [
        {
            block: 'i-lego-example',
            js: true,
            content: [
                {
                    tag: 'table',
                    content: {
                        tag: 'tr',
                        content: [
                            {
                                tag: 'td',
                                attrs: { style: 'padding: 20px'},
                                content: {
                                    block: 'select',
                                    name: 'mail',
                                    mods: { size: 'm', theme: 'normal' },
                                    content: [
                                        {
                                            block: 'button',
                                            content: 'Черновики'
                                        },
                                        {
                                            elem: 'control',
                                            content: [
                                                {
                                                    elem: 'option',
                                                    attrs: { value: 'draft' },
                                                    content: 'Черновики'
                                                },
                                                {
                                                    elem: 'option',
                                                    attrs: { value: 'inbox' },
                                                    content: 'ВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящиеВходящие'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                tag: 'td',
                                content: {
                                    block: 'button',
                                    mods: { size: 'm' },
                                    content: 'Я.Submit'
                                }
                            }
                        ]
                    }
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_18-fixed-in-table.js' }
    ]
})
