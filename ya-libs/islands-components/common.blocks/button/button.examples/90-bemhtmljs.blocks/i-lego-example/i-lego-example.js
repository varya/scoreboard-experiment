BEM.DOM.decl('i-lego-example', {

    onSetMod : {

        'js': function() {

            this.domElem.append(BEMHTML.apply(
                {
                    block: 'button',
                    mods: { size: 'm' },
                    content: 'Я.Простая кнопка'
                }
            ));

            this.domElem.append(BEMHTML.apply(
                {
                    block: 'button',
                    mods: { size: 'm', shadow: 'yes' },
                    content: 'Я.Кнопка с тенью',
                    id: 'my-id'
                }
            ));

            this.domElem.append(BEMHTML.apply(
                {
                    block: 'button',
                    mods: { theme: 'action', size: 'm' },
                    content: 'Я.Submit',
                    type: 'submit',
                    name: 'my-submit'
                }
            ));

            this.domElem.append(BEMHTML.apply(
                {
                    block: 'button',
                    mods: { size: 'm' },
                    content: 'Я.Ссылка',
                    url: 'http://www.yandex.ru'
                }
            ));

            BEM.DOM.init(this.domElem);

        }

    }

});
