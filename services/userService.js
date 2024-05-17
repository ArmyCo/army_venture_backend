const { appDataSource } = require('../models/data-source');
const jwt = require('jsonwebtoken');
const User = appDataSource.getRepository('User');

// JWT 토큰 생성 함수
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 사용자 정보 조회
const getUserByEmail = async (email) => {
  console.log(`이메일로 사용자 조회: ${email}`);
  return await User.findOne({ where: { email } });
};

// 사용자 생성
const createUser = async (userData) => {
  const newUser = User.create(userData);
  await User.save(newUser);
  return newUser;
};

// 구글 로그인 로직
const googleLogin = async (googleUserData) => {
  console.log(`구글 로그인 시도: ${googleUserData.email}`);
  let user = await getUserByEmail(googleUserData.email);
  if (!user) {
    console.log('사용자가 존재하지 않으므로 새로 생성합니다:', googleUserData.email);
    user = await createUser({
      email: googleUserData.email,
      name: googleUserData.name, // 가정: 클라이언트에서 이름을 제공
      password: 'oauth2password', // 기본 비밀번호 설정
    });
  }

  const token = generateToken(user);
  return { user, token };
};

module.exports = {
  getUserByEmail,
  createUser,
  googleLogin,
  generateToken,
};
