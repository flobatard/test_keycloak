exports.getAuthorizationToken = (req) => 
{
    const authHeader = req.headers['authorization']
    const token = req.cookies.BOC_TOKEN || authHeader && authHeader.split('$')[1]
    return token
}

exports.authenticateToken = (req, res, next) => 
{
    const token = this.getUserToken(req)
    
    if (token === undefined || token === null || token == "Guest")
    {
        req.user = null;
    }
    else
    {
        try{
            const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
            req.user = user; 
        }
        catch(err)
        {
            req.user = null
            req.userTokenExpired = true
        }
    }
    next();
}
