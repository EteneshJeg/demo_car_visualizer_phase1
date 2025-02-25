const dbConnection = require('../db/dbConfig')

async function register(req,res) {
    res.send('register')
}
async function login(req,res) {
    res.send('login')
}
async function check(req,res) {
    res.send('check')
}

module.exports = {register,login,check}