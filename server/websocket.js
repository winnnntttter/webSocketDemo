const express = require('express');
const expressWs = require('express-ws');
const router = express.Router();
expressWs(router);

let clients = []; // 保存所有连接的客户端

router.ws('/test', (ws, req) => {
    ws.send('连接成功');
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws); // 过滤掉关闭的客户端
    });

    let interval;
    interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(Math.random().toFixed(2));
        } else {
            clearInterval(interval);
        }
    }, 1000);

    ws.on('message', msg => {
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

        // 广播消息
        clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(msg);
            }
        });
    });
});

module.exports = router;
