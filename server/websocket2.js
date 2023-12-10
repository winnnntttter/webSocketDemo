const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const router = express.Router();
expressWs(router);

router.use(bodyParser.json()); // 使用 body-parser 解析 JSON 数据

// 普通接收消息的路由, 将消息广播给所有websocket客户端
router.post('/test', (req, res) => {
    // console.log(req.body);
    const { msg } = req.body;
    res.send('ok');
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(msg);
        }
    });
});

let wsClients = []; // 保存所有连接的客户端
router.ws('/test', (ws, req) => {
    ws.send('连接成功');
    wsClients.push(ws);

    ws.on('close', () => {
        wsClients = wsClients.filter(client => client !== ws); // 过滤掉关闭的客户端
    });

    let interval;
    interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(Math.random().toFixed(2));
        } else {
            clearInterval(interval);
        }
    }, 1000);

    /* ws.on('message', msg => {
        if (msg === 'close') {
            ws.close();
        }
        if (msg === 'pause') {
            clearInterval(interval);
        }
        if (msg === 'start') {
            interval = setInterval(() => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(Math.random().toFixed(2));
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }); */
});

module.exports = router;
