## shared
all packages 共享模块

### node命令行模块
`alita-cli`， `alita-core`等node命令行模块，使用的时候需要配合`babel-plugin-module-resolver`

### npm模块
`wx-react`等npm模块，由于发布的时候，会经过`rollup`打包，故而不用处理，直接导入即可
