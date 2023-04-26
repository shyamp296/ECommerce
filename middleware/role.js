const jwt = require('jsonwebtoken')
const User = require('../models/user_model')


const SECRET_KEY = "Shyamdadhaniya"

const roler = async (res, req, next) => {
    try {
        const token = res.cookies.token
        if (token) {
            const users = jwt.verify(token, SECRET_KEY)
            req.users = users
            id = users.id
            const userss = await User.findById(id)
            role = userss.role

            next()

        } else {
            
            role = '0'
            next()
        }
    } catch (error) {

        console.log(error);
    }
}

module.exports = roler