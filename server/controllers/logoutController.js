// Tokens are stateless; the client simply discards its token on logout.
const handleLogout = async (req, res) => {
    res.sendStatus(204);
};

export default handleLogout;
