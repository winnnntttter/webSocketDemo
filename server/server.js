const express = require('express');
const app = express();
const expressWs = require('express-ws');
// const websocket = require('./websocket'); // 两个页面都使用同一个websocket，使用websocket路由向后台发送消息, 并广播给所有websocket客户端
const websocket = require('./websocket2'); // 使用普通路由向后台发送消息, 并广播给所有websocket客户端

// 取消跨域
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });
    next();
});


expressWs(app);

app.use(express.static('public'));
app.use('/websocket', websocket);
app.get('*', (req, res) => {});
app.listen(3000, () => {
    console.log('server is listening on port 3000');
});
