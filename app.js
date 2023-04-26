const express = require('express')
const mongoose = require('mongoose')
let PORT = process.env.PORT || 8000


const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const nodeMailer = require('nodemailer')
const multer = require('multer')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const userRoutes = require('./routes/user_Route')

const authRoutes = require('./routes/auth_routes')

const adminRoutes = require('./routes/admin_routes')

const productRoutes = require('./routes/product_routes')


app.use(bodyParser.urlencoded({ extended: false }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const extname = fileTypes.test(path.extname(file.originalname))
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images only!')
    }
}
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'))

// calling routes
app.use(cookieParser())

app.use(userRoutes)
app.use(authRoutes)
app.use(adminRoutes)
app.use(productRoutes)



//connection with databse & listening port

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/ecommerce').then((result) => {
    app.listen(PORT)
    console.log(`connection successful on port ${PORT}`);
}).catch((err) => {
    console.log(err);
});
