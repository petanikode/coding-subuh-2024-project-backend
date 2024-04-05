const bcrypt = require("bcrypt");

function hashPassword(plaintextPassword) {
    const hash = bcrypt.hashSync(plaintextPassword, 10);
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