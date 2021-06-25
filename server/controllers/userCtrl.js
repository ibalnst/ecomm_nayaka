import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
	try {
		const { name, email, password,role } = req.body;
		const user = await userModel.findOne({ email });

		if (user) return res.status(400).json({ msg: 'the email already exist' });

		if (password.length < 6) return res.status(400).json({ msg: 'Password must be 6 charaters' });

        const passwordHash = await bcrypt.hash( password, 10 );
        
	    const newUser = new userModel({
			name,
			email,
            password: passwordHash,
            role: 0
		});

		// Menyimpan ke Mongodb
        await newUser.save();
        
        // Membuat koneksi autentikasi jsonwebtoken
        const accsesToken = createAccesToken( { id: newUser._id } );
        const refreshToken = createRefreshToken( { id: newUser._id } )
        
        res.cookie( 'refreshToken', refreshToken, {
            httpOnly: true,
            path:'/user/refresh_token'
        })



        res.json( { accsesToken } );
		// res.json({ msg: 'Sucsess' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};


export const refreshToken = ( req, res ) => {
    try {
        const rf_token = req.cookies.refreshToken;
        if ( !rf_token ) return res.status( 400 ).json( { msg: 'Please Login or Register' } )
        jwt.verify( rf_token, process.env.REFRESH_TOKEN_SECRET, ( err, user ) => {
            if ( err ) return res.status( 400 ).json( { msg: 'Please Login or Register' } );
            const accsestoken = createAccesToken( { id: user._id } );
            res.json( {user,accsestoken})
        } )
        // res.json( { rf_token } );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const login = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne( { email } )
        if ( !user ) return res.status( 400 ).json( { msg: 'User doesnt exist' } )
        const isMatch = await bcrypt.compare( password, user.password );
        if ( !isMatch ) return res.status( 400 ).json( { msg: 'Password not incorrect' } );

        // Jika sukses , buat token untuk akses dan refresh
        const accsesToken = createAccesToken( { id: user._id } );
        const refreshToken = createRefreshToken( { id: user._id } )
        
        res.cookie( 'refreshToken', refreshToken, {
            httpOnly: true,
            path:'/user/refresh_token'
        })


        res.json( { accsesToken } );


        res.json({msg:'Login Sucsess'})

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const logout = async ( req, res ) => {
    try {
        res.clearCookie( 'refreshToken', { path: '/user/refresh_token' } );
        return res.json( { msg: 'Logged Out' } );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getUser = async ( req, res ) => {
    try {
        // id didapat setelah melakukan json(req.user) && select digunakan untuk menghilangkan password.
        const user = await userModel.findById(req.user.id).select('-password')
        if ( !user ) return res.status( 400 ).json( { msg: 'User doesnt exist' } )
        res.json( user );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const createAccesToken = user => {
    return jwt.sign( user, process.env.ACCSESS_TOKEN_SECRET, {expiresIn:'1d'})
}
const createRefreshToken = user => {
    return jwt.sign( user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}

