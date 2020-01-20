import MpJsonpMainTemplatePlugin from './MpJsonpMainTemplatePlugin'
import MpJsonpChunkTemplatePlugin from './MpJsonpChunkTemplatePlugin'
import JsonpHotUpdateChunkTemplatePlugin from 'webpack/lib/web/JsonpHotUpdateChunkTemplatePlugin'

export default class MiniprogramJsonpPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap("MiniprogramJsonpPlugin", compilation => {
            new MpJsonpMainTemplatePlugin().apply(compilation.mainTemplate);
            new MpJsonpChunkTemplatePlugin().apply(compilation.chunkTemplate);
            new JsonpHotUpdateChunkTemplatePlugin().apply(
                compilation.hotUpdateChunkTemplate
            );
        });
    }
}

