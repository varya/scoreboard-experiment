BEM.DOM.decl('popup', {

    onSetMod : {
        'js' : function() {

            this.__base();

            /**
             * Посчитанные позиции хвоста внутри(относительно) блока
             * @private
             * @type {Object}
             */
            this._tailPos = { };

        }
    },

    /**
     * Высчитывает позицию хвоста внутри блока с учётом направления
     * @private
     * @param {Object} direction - параметры открытия блока
     * @return {Object}
     */
    _calcTailPos : function(direction) {

        var to = direction.to,
            currentPos = this._positions[direction.key],
            axis = direction.tail.axis,
            position = { };

            if(to == 'top' || to == 'bottom') {
                position.left = this._calcTailLeft(axis, currentPos);
            } else if(to == 'left' || to == 'right') {
                position.top = this._calcTailTop(axis, currentPos);
            }

        return position;

    },

    /**
     * Высчитывает вертикальную координату по оси
     * @private
     * @param {String} axis - имя оси для рассчетов
     * @param {Object} popupPos - текущие координаты блока
     * @return {Number}
     */
    _calcTailTop : function(axis, popupPos) {

        var top = 0,
            correction = 0,

            ownerSize = this.getOwnerSize(),
            ownerPos = this.getOwnerPos(),

            tailHeight = this.params.tail.width,

            popupSize = this.getPopupSize(),

            chunk = popupSize.height,
            topOffset = ownerPos.top - popupPos.top,
            bottomOffset = (popupPos.top + popupSize.height) -
                (ownerPos.top + ownerSize.height);

        if(topOffset > 0) {
            top += topOffset;
            chunk -= topOffset;
        }

        bottomOffset > 0 && (chunk -= bottomOffset);

        if(axis == 'middle') {
            chunk -= tailHeight;
            top += chunk / 2;
        } else if(axis == 'bottom') {
            chunk -= tailHeight;
            top += chunk;
        }

        top < 0 && (top = 0);

        return top;

    },

    /**
     * Высчитывает горизонтальную координату по оси
     * @private
     * @param {String} axis - имя оси для рассчетов
     * @param {Object} popupPos - текущие координаты блока
     * @return {Number}
     */
    _calcTailLeft : function(axis, popupPos) {

        var left = 0,
            correction = 0,

            ownerSize = this.getOwnerSize(),
            ownerPos = this.getOwnerPos(),

            tailWidth = this.params.tail.width,

            popupSize = this.getPopupSize(),

            leftOffset = ownerPos.left - popupPos.left,
            chunk = popupSize.width,
            rightOffset = (popupPos.left + popupSize.width) -
                (ownerPos.left + ownerSize.width);

        if(leftOffset > 0) {
            left += leftOffset;
            chunk -= leftOffset;
        }

        rightOffset > 0 && (chunk -= rightOffset);

        if(axis == 'center') {
            chunk -= tailWidth;
            left += chunk / 2;
        } else if(axis == 'right') {
            chunk -= tailWidth;
            left += chunk;
        }

        return left;

    },

    /**
     * Вычисляет насколько нужно сместить начало
     * координат для нормального отображения хвоста
     * @private
     * @param {Object} params - параметры открытия блока
     * @return {Object}
     */
    _calcOffsetByTail : function(params) {
        var tail = this.params.tail,

            height = tail.height,

            position = { };

        switch(params.to) {
            case 'top' :
                position = { top: -height };

                break;

            case 'bottom' :
                position = { top: height };

                break;

            case 'right' :
                position = { left: height };

                break;

            case 'left' :
                position = { left: -height };

                break;
        }

        return position;
    },

    /**
     * Возвращает смещение хвоста для текущего направления раскрытия
     * и оси по которой позиционируется хвост
     * @private
     * @param {Object} direction - параметры направления раскрытия
     * @return {Object} - смещение координат
     */
    _calcTailOffset : function(direction) {

        var offset = { },
            to = direction.to,

            tailParams = direction.tail,
            tailOffset = tailParams.offset,
            tailAxis = tailParams.axis;

        if(!tailOffset) {
            return false;
        }

        if(to == 'top' || to == 'bottom') {
            offset.left = 0;

            if(tailAxis == 'left') {
                offset.left += tailOffset.left;
            } else if(tailAxis == 'center') {
                tailOffset.left && (offset.left += tailOffset.left);
                tailOffset.right && (offset.left -= tailOffset.right);
            } else if(tailAxis == 'right') {
                offset.left -= tailOffset.right;
            }
        } else if(to == 'left' || to == 'right') {
            offset.top = 0;

            if(tailAxis == 'top') {
                offset.top += tailOffset.top;
            } else if(tailAxis == 'middle') {
                tailOffset.top && (offset.top += tailOffset.top);
                tailOffset.bottom && (offset.top -= tailOffset.bottom);
            } else if(tailAxis == 'bottom') {
                offset.top -= tailOffset.bottom;
            }
        }

        return offset;

    },

    /**
     * Обнуляет позицию хвоста
     * @private
     * @param {String} key - ключ направления
     * @return {block}
     */
    _resetTailPos : function(key) {

        key?
            (this._tailPos[key] = null) :
            (this._tailPos = { });

        return this;

    },

    /**
     * Смещает позицию хвоста на указанные во втором аргументе координаты с учётом текущей позиции
     * @param {String} [key] - Уникальный ключ направления
     * @param {Object} offset - Объект, описывающий позицию для смещения
     * @return {block}
     */
    _pushTailPos : function(key, offset) {

        this._pushPosTo(this._tailPos, key, offset);

        return this;

    }

});
