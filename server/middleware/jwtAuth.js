const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the decoded payload in res.locals for access in subsequent middleware or route handlers
        res.locals.jwtPayload = decoded;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    jwtAuth
};
