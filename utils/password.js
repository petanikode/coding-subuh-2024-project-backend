const bcrypt = require("bcrypt");

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}
 
// compare password
function comparePassword(plaintextPassword, hash) {
    const result = bcrypt.compareSync(plaintextPassword, hash);
    return result;
}

module.exports = {
    hashPassword,
    comparePassword
}