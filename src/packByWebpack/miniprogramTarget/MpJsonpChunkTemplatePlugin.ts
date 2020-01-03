import configure from '../../configure'

const { ConcatSource } = require("webpack-sources");

const getEntryInfo = chunk => {
    return [chunk.entryModule].filter(Boolean).map(m =>
        [m.id].concat(
            Array.from(chunk.groupsIterable)[0]
                // @ts-ignore
                .chunks.filter(c => c !== chunk)
                .map(c => c.id)
        )
    );
};


export default class MpJsonpChunkTemplatePlugin {
    /**
     * @param {ChunkTemplate} chunkTemplate the chunk template
     * @returns {void}
     */
    apply(chunkTemplate) {
        chunkTemplate.hooks.render.tap(
            "JsonpChunkTemplatePlugin",
            (modules, chunk) => {
                const jsonpFunction = chunkTemplate.outputOptions.jsonpFunction;

                const source = new ConcatSource();
                const prefetchChunks = chunk.getChildIdsByOrders().prefetch;
                source.add(
                    `(${configure.mpGlobalObject}[${JSON.stringify(
                        jsonpFunction
                    )}] = ${configure.mpGlobalObject}[${JSON.stringify(
                        jsonpFunction
                    )}] || []).push([${JSON.stringify(chunk.ids)},`
                );
                source.add(modules);
                const entries = getEntryInfo(chunk);
                if (entries.length > 0) {
                    source.add(`,${JSON.stringify(entries)}`);
                } else if (prefetchChunks && prefetchChunks.length) {
                    source.add(`,0`);
                }

                if (prefetchChunks && prefetchChunks.length) {
                    source.add(`,${JSON.stringify(prefetchChunks)}`);
                }
                source.add("])");
                return source;
            }
        );
        chunkTemplate.hooks.hash.tap("JsonpChunkTemplatePlugin", hash => {
            hash.update("JsonpChunkTemplatePlugin");
            hash.update("4");
            hash.update(`${chunkTemplate.outputOptions.jsonpFunction}`);
            hash.update(`${configure.mpGlobalObject}`);
        });
        chunkTemplate.hooks.hashForChunk.tap(
            "JsonpChunkTemplatePlugin",
            (hash, chunk) => {
                hash.update(JSON.stringify(getEntryInfo(chunk)));
                hash.update(JSON.stringify(chunk.getChildIdsByOrders().prefetch) || "");
            }
        );
    }
}