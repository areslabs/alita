import * as path from "path";

import configure from '../configure'

export const handleChanged = (info) => {

    const newWxOutFiles = {}
    const {appJSON} = info.entryInfo

    const appJSONPath = path.resolve(configure.outputFullpath, 'app.json')
    newWxOutFiles[appJSONPath] = JSON.stringify(appJSON, null, '\t')

    return newWxOutFiles
}


