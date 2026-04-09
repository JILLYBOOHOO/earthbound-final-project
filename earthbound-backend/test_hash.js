const bcrypt = require('bcryptjs');

const hash = '$2b$10$O3SwLpkF.p9FX4Isxgi9oOOIpuyUy.kmGWW1Wa9IqvpeCfgnt65MG';
const password = 'admin123';

bcrypt.compare(password, hash).then(isMatch => {
    console.log(`Password 'admin123' match: ${isMatch}`);
});
