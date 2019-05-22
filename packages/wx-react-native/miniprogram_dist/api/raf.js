const loadTime = Date.now()
function now() {
    return Date.now() - loadTime
}


var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

export var requestAnimationFrame = function(callback) {
    if(queue.length === 0) {
        var _now = now()
            , next = Math.max(0, frameDuration - (_now - last))
        last = next + _now
        setTimeout(function() {
            var cp = queue.slice(0)
            // Clear queue here to prevent
            // callbacks from appending listeners
            // to the current frame's queue
            queue.length = 0
            for(var i = 0; i < cp.length; i++) {
                if(!cp[i].cancelled) {
                    try{
                        cp[i].callback(last)
                    } catch(e) {
                        setTimeout(function() { throw e }, 0)
                    }
                }
            }
        }, Math.round(next))
    }
    queue.push({
        handle: ++id,
        callback: callback,
        cancelled: false
    })
    return id
}

export var cancelAnimationFrame = function(handle) {
    for(var i = 0; i < queue.length; i++) {
        if(queue[i].handle === handle) {
            queue[i].cancelled = true
        }
    }
}