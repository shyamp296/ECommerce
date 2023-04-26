const jwt = require('jsonwebtoken')
const User = require('../models/user_model')


const SECRET_KEY = "Shyamdadhaniya"

const auth = async (res, req, next) => {


    try {

        const token = res.cookies.token
        if(token){
        const users = jwt.verify(token, SECRET_KEY)
        
        
        req.users = users
        
        id = users.id
            const userss = await User.findById(id)
            role = userss.role
            user = userss

          
        
        next()

        }else { 
            return req.redirect('/sign-In')
        }
    } catch (error) {
        
        console.log(error);
    }
}

module.exports = auth