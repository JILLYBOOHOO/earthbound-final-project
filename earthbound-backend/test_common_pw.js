const bcrypt = require('bcryptjs');

const hash = '$2b$10$O3SwLpkF.p9FX4Isxgi9oOOIpuyUy.kmGWW1Wa9IqvpeCfgnt65MG';

bcrypt.compare('admin', hash).then(m => console.log('admin:', m));
bcrypt.compare('password', hash).then(m => console.log('password:', m));
bcrypt.compare('admin123', hash).then(m => console.log('admin123:', m));
bcrypt.compare('earthbound', hash).then(m => console.log('earthbound:', m));
