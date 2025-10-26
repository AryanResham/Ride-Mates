
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.roles) return res.sendStatus(204); //No content

    res.clearCookie('roles', { httpOnly: true, sameSite: 'None', secure: false }); //secure: true is for https connection
    res.sendStatus(204);
}

export default handleLogout;