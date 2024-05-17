const { appDataSource } = require('../models/data-source');
const jwt = require('jsonwebtoken');
const User = appDataSource.getRepository('User');

// JWT 토큰 생성 함수
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const createUser = async (userData) => {
  const user = User.create(userData);
  await User.save(user);
  return user;
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// 구글 OAuth 로그인 후 JWT 토큰 발급
const googleLogin = async (googleUserData) => {
  let user = await getUserByEmail(googleUserData.email);

  if (!user) {
    user = await createUser({
      email: googleUserData.email,
      name: googleUserData.name,
      gender: googleUserData.gender,
      birth: new Date(googleUserData.birth), // 구글에서 받아오는 생일 데이터 형식에 맞춰 변환 필요
      user_army_number: googleUserData.user_army_number,
      user_status_id: googleUserData.user_status_id,
      phone_number: googleUserData.phone_number,
      belonged_unit_id: googleUserData.belonged_unit_id,
    });
  }

  const token = generateToken(user);
  return { user, token };
};

module.exports = {
  createUser,
  getUserByEmail,
  googleLogin,
};
