const bcrypt = require('bcryptjs')

exports.hashPassword = async(password) => {
    const ROUNDS = process.env.ROUNDS || 12
    // console.log('ROUNDS', ROUNDS)
    const salt = await bcrypt.genSalt(parseInt(ROUNDS));
    const hash = await bcrypt.hash(password, salt);
    return hash;
}