export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["app.css","favicon.png"]),
	mimeTypes: {".css":"text/css",".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-6d2b64e2.js","imports":["_app/immutable/start-6d2b64e2.js","_app/immutable/chunks/index-b63fe933.js","_app/immutable/chunks/singletons-13208249.js","_app/immutable/chunks/index-3db428e0.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
