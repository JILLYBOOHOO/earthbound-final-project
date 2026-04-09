const http = require('http');

const registerData = JSON.stringify({
    username: 'testfix',
    email: 'fix@example.com',
    password: 'test1234'
});

const loginData = JSON.stringify({
    email: 'fix@example.com',
    password: 'test1234'
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
        console.log('Registering test user...');
        const regRes = await postRequest('/api/auth/register', registerData);
        console.log('Register response:', regRes);

        console.log('Logging in with test user...');
        const logRes = await postRequest('/api/auth/login', loginData);
        console.log('Login response:', logRes);
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
