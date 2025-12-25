const bcrypt = require('bcryptjs');

// Hash password 'password123'
const password = 'password123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL Update Command:');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@recap.local';`);

