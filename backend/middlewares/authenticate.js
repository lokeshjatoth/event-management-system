import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userData;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
};