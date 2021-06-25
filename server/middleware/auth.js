import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const auth = ( req, res, next ) => {
    try {
        const token = req.header( "Authorization" )
        if ( !token ) return res.status( 400 ).json( { msg: 'Invalid Authorization' } )
        jwt.verify( token, process.env.ACCSESS_TOKEN_SECRET, ( err, user ) => {
            if ( err ) return res.status( 400 ).json( { msg: 'Invalid Authorization' })
            req.user = user
            next()
        } )
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
    
}


export const authAdmin = async ( req, res, next ) => {
    try {
        // const userId = { _id: req.user.id }
        const user = await userModel.findOne( {_id: req.user.id})
        if ( user.role === 0 ) return res.status( 500 ).json( { msg: "Admin resources denied" } )
        next()  
    } catch (error) {
        return res.status( 500 ).json( { msg:error.message})
    }
}
