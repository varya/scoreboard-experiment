({
    block: 'b-page',
    mix: [{ block: 'i-ua', js: true }],
    title: 'Псевдо-кнопка',
    head: [
        { elem: 'css', url: '_55-pseudo.css', ie: false },
        { elem: 'css', url: '_55-pseudo', ie: true }
    ],
    content: {
        attrs: { style: 'margin: 20px' },
        content: [
            'Чаще всего псевдо-кнопка — это ссылка, при нажатии на которую JavaScript запускает какое-либо действие (popup и прочее).' +
            'При отстуствии JavaScript происходит переход по ссылке <br><br>',
            {
                block: 'button',
                url: '#',
                mods: { size: 's', pseudo: 'yes' },
                content: 'Псевдо-кнопка ссылкой'
            },'&nbsp;&nbsp;&nbsp;<br><br>',
            {
                block: 'button',
                url: '#',
                mods: { size: 'm', pseudo: 'yes' },
                content: 'Псевдо-кнопка ссылкой'
            },'&nbsp;&nbsp;&nbsp;<br><br>',
            {
                block: 'button',
                mods: { size: 's', pseudo: 'yes' },
                content: 'Псевдо-кнопка'
            },'&nbsp;&nbsp;&nbsp;<br><br>',
            {
                block: 'button',
                mods: { size: 'm', pseudo: 'yes' },
                content: 'Псевдо-кнопка'
            },
            { block: 'i-jquery', mods: { version: '1.8.3' }},
            { elem: 'js', url: '_55-pseudo.js' }
        ]
    }
})
