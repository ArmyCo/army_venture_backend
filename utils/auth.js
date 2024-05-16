const jwt = require('jsonwebtoken');
const { appDataSource } = require('../models/data-source');

const loginRequired = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await appDataSource.query(
            `SELECT * FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (user.length === 0) {
            return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
        }

        req.user = user[0];
        next();
    } catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = { loginRequired };
