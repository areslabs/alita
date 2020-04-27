function isTargetMp(caller) {
	return caller && caller.name === 'babel-loader' && caller.target === 'mini-program'
}

module.exports = function (api) {
	const isMp = api.caller(isTargetMp);

	api.cache(true);

	if (isMp) {
		return {
			presets: [require('babel-preset-react-app')],
		}
	}

	return {
		presets: [require('metro-react-native-babel-preset')],
	}
}
