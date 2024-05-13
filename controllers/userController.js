const bcrypt = require('bcrypt');
const { User } = require('../models');

// 회원가입
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username: username,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully!",
            userId: newUser.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 로그인
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        res.status(200).json({
            message: "User logged in successfully!",
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 로그아웃
exports.logout = async (req, res) => {
    res.status(200).json({
        message: "Logged out successfully!"
    });
};
