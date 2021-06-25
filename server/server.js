import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import categoryRouter from './routes/categoryRouter.js';

const app = express();
dotenv.config();

app.use( express.json() );
app.use( cookieParser() );
app.use( cors() );
app.use( fileUpload( {
    useTempFiles: true
} ) );


// Routes
app.use('/user', userRouter)
app.use('/api', categoryRouter)

// Koneksi ke mongoDB

const PORT = process.env.PORT || 5000
const URI = process.env.MONGO_DB;

mongoose.connect(URI , {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if ( err ) throw new err;
    console.log('Connected with mongoDB');
} )

app.get( '/', ( req, res) => {
    res.send('Connected Api')
})

app.listen( PORT, () => {
    console.log(`Server Running on PORT : ${PORT}`)
})