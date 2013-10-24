({
    block: 'b-page',
    title: 'Простая кнопка',
    head: [
        { elem: 'css', url: '_57-pseudo-button-link.css', ie: false },
        { elem: 'css', url: '_57-pseudo-button-link', ie: true }
    ],
    content: [
        {
            attrs: { style: 'margin: 20px' },
            content: [
                {
                    tag: 'form',
                    attrs: { action: 'bbb' },
                    content: [
                        'Псевдокнопки, которые не нажимаются:<br><br>',
                        {
                            block: 'button',
                            mods: { size: 'm', theme: 'pseudo' },
                            content: 'Серебряническая наб., д.29'
                        },
                        '<br/><br/><br/>',
                        {
                            block: 'button',
                            mods: { size: 's', theme: 'pseudo' },
                            content: 'Серебряническая наб., д.29'
                        },
                        '<br/><br/><br/>',
                        'Псевдокнопки, которые нажимаются:<br><br>',
                        {
                            block: 'button',
                            mods: { size: 'm', theme: 'pseudo', 'pseudo-pressed': 'yes' },
                            content: 'Серебряническая наб., д.29'
                        },
                        '<br/><br/><br/>',
                        {
                            block: 'button',
                            mods: { size: 's', theme: 'pseudo', 'pseudo-pressed': 'yes' },
                            content: 'Серебряническая наб., д.29'
                        }
                    ]
                }
            ]
        },
        { block: 'i-jquery', mods: { version: '1.8.3' }},
        { elem: 'js', url: '_57-pseudo-button-link.js' }
    ]
})
