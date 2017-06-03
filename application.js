
// Require your application JS files here

Realm = undefined;


function requireAll(r) { r.keys().forEach(r); }

requireAll(require.context('./pages/', true, /\.(js|css|html)$/));
requireAll(require.context('./views/', true, /\.(js|css|html)$/));
requireAll(require.context('./components/', true, /\.(js|css|html)$/));
requireAll(require.context('./models/', true, /\.(js|css|html)$/));
requireAll(require.context('./interceptors/', true, /\.(js|css|html)$/));
requireAll(require.context('./validators/', true, /\.(js|css|html)$/));
requireAll(require.context('./dist/compiled/', true, /\.(js|css|html)$/));

