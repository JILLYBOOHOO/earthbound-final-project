const http = require('http');

const loginData = JSON.stringify({
    email: 'admin@earthbound.com',
    password: 'admin123'
});

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3100,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: body }));
        });
        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
};

(async () => {
    try {
        console.log('Logging in with admin user...');
        const logRes = await postRequest('/api/auth/login', loginData);
        console.log('Login response:', logRes);
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
