const bcrypt = require('bcryptjs');

const hash = '$2b$10$lUBoURaYNVvaI7TFRiLSxOfKoDM6WP3yfXaancBIw2hTQFTmXjrni';
const password = 'admin123';

bcrypt.compare(password, hash).then(isMatch => {
    console.log(`Password 'admin123' match: ${isMatch}`);
});
