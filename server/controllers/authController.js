import User from '../models/User.js';
import bcrypt from 'bcrypt';

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    const match = await bcrypt.compare(pwd, foundUser.passwordHash);

    if (match) {
        const roles = Object.values(foundUser.role);
        console.log(roles);

        res.cookie('role', roles, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 }); //secure: true is for https connection
        res.cookie('email', email, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 }); // Store email for identifying user


        res.json({ 'success': `User ${email} is logged in!`, roles });
    } else {
        res.sendStatus(401);
    }
}

export default handleLogin;