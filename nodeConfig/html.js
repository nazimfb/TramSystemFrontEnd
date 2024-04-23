const http = require("http");
const fs = require("fs");
const path = require("path");

const host = '192.168.1.69';
const port = 8000;
const htmlDir = "../html";
const cssDir = "../styles"; 
const jsDir = "../scripts"; 
const staticDir = "../static"; 

const requestListener = function (req, res) {
    let filePath = path.join(__dirname, htmlDir, req.url);

    if (path.extname(filePath).toLowerCase() === '.html') {
        serveFile(filePath, res);
    } else {
        let referrer = req.headers.referer;
        if (referrer && referrer.indexOf(`${host}:${port}`) !== -1) {
            if (req.url.startsWith('/styles')) {
                serveFile(path.join(__dirname, cssDir, path.basename(filePath)), res);
            } else if (req.url.startsWith('/scripts')) {
                serveFile(path.join(__dirname, jsDir, path.basename(filePath)), res);
            } else if (req.url.startsWith('/static')) {
                serveFile(path.join(__dirname, staticDir, path.basename(filePath)), res);
            } else {
                res.writeHead(403);
                res.end("403 Forbidden: Direct access to files is not allowed");
            }
        } else {
            // Otherwise, deny access
            res.writeHead(403);
            res.end("403 Forbidden: Direct access to files is not allowed");
        }
    }
};

function serveFile(filePath, res) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            //file not found - 404 response
            res.writeHead(404);
            res.end("404 Not Found");
            return;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("500 Internal Server Error");
                return;
            }

            let contentType = 'text/html';
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.css') {
                contentType = 'text/css';
            } else if (ext === '.js') {
                contentType = 'text/javascript';
            }

            res.setHeader("Content-Type", contentType);

            res.writeHead(200);
            res.end(data);
        });
    });
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
