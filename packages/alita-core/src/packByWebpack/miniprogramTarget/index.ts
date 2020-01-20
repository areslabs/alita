
import FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import FetchCompileWasmTemplatePlugin from 'webpack/lib/web/FetchCompileWasmTemplatePlugin'
//import JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'

import MiniprogramJsonpPlugin from './MiniprogramJsonpPlugin'

export default function(compiler) {
    // webpack内部以 options.target(compiler)形式调用，故而这里的this，指向options配置对象


    new MiniprogramJsonpPlugin().apply(compiler);
    new FetchCompileWasmTemplatePlugin({
        mangleImports: this.optimization.mangleWasmImports
    }).apply(compiler);
    new FunctionModulePlugin().apply(compiler);
    new NodeSourcePlugin(this.node).apply(compiler);
    new LoaderTargetPlugin("mini-program").apply(compiler);
}