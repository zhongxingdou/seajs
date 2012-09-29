seajs.config({
    alias: {
        "timestamp": "timestamp.js?t=" + seajs.pluginSDK.config.publish_date
    }
});

define("seajs/plugin-timestamp", function(require) {
    // Hack Module._resolve method
    extendResolve();

    var timestamp = require("timestamp");

    // Helpers
    function extendResolve() {
        var Module = seajs.pluginSDK.Module;
        var _resolve = Module._resolve;
        Module._resolve = function() {
            return getRealPath(_resolve.apply(null, arguments));
        }
    }

    function getRealPath(url) {
        if (timestamp) {
            var updatedTime;

            if (url.indexOf("??") != -1) { //combo
                updatedTime = getComboUpdatedTime(timestamp, url);
            } else {
                updatedTime = getUpdatedTime(timestamp, parsePath(url));
            }

            if (updatedTime) {
                var connChar = url.replace("??", "").indexOf("?") == -1 ? "?" : "&";
                url = url + connChar + "t=" + updatedTime;
            }
        }
        return url;
    }

    function parsePath(url) {
        var RE = /^.*?\//;
        var pathes = url.replace(RE, '').split('/').slice(2);
        var lastIndex = pathes.length - 1;
        pathes[lastIndex] = pathes[lastIndex].split('?')[0];
        return pathes;
    }

    function getUpdatedTime(timestamp, pathes) {
        var updatedTime, currPath;
        for (var i = 0, l = pathes.length; i < l; i++) {
            currPath = timestamp[pathes[i]];
            if (currPath) {
                timestamp = currPath;
                if (i == (l - 1)) {
                    updatedTime = timestamp;
                }
            } else {
                updatedTime = "";
                break;
            }
        }
        return updatedTime;
    }

    function getComboUpdatedTime(timestamp, url) {
        var gap = "??",
            urls = url.substr(url.indexOf(gap) + gap.length).split(","),
            pathes, maxinumTime = 0,
            currTime;

        for (var i = 0, l = urls.length; i < l; i++) {
            pathes = urls[i].replace(/^\//, '').split("/");
            currTime = getUpdatedTime(timestamp, pathes) || -1;
            if (currTime > maxinumTime) {
                maxinumTime = currTime;
            }
        }
        return maxinumTime;
    }
});

(function() {
    var _preload = seajs.pluginSDK.config.preload;

	var pluginId = "seajs/plugin-timestamp"

	seajs.pluginSDK.config.preload = [pluginId];

	if(_preload.length){
		//filter this plugin in preload
		var _newPreload = [];
		var m;
		while(m = _preload.pop()){
			if(m !=  pluginId){
				_newPreload.push(m);
			}
		}

		if(_newPreload.length){
			seajs.use(_newPreload);
		}
	}
})();
