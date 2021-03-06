var PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ');

exports.baseLevelPath = require.resolve('../../.bem/levels/bundles.js');

exports.getConfig = function() {

    return BEM.util.extend(this.__base() || {}, {
        bundleBuildLevels: this.resolvePaths([
                'bem-bl/blocks-common',
                'bem-bl/blocks-desktop',
                'bem-mvc/common.blocks',
                'bem-mvc/desktop.blocks',
                'bem-history/common.blocks'
            ]
            .map(function(path) { return PATH.resolve(environ.LIB_ROOT, path); })
            .concat([
                'ya-libs/romochka/common.blocks',
                'libs/bem-components/common.blocks',
                'ya-libs/islands-components/common.blocks',
                'libs/bem-components/desktop.blocks',
                'ya-libs/bem-components/desktop.blocks',
                'common.blocks',
                'desktop.blocks'
            ]
            .map(function(path) { return PATH.resolve(environ.PRJ_ROOT, path); })))
    });

};
