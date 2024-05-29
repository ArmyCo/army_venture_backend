const axios = require('axios');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_LOGIN_REDIRECT_URI,
  GOOGLE_SIGNUP_REDIRECT_URI,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} = require('../config/oauth');

// 구글 로그인 및 회원가입 URL 발급
const login = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(url);
};

const signup = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(url);
};

// 구글 로그인 리다이렉트 처리
const loginRedirect = async (req, res) => {
  const { code } = req.query;
  console.log(`Login code: ${code}`);
  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    console.log(`Token response data: ${JSON.stringify(tokenResponse.data)}`);
    console.log(`User info from Google: ${JSON.stringify(userResponse.data)}`);

    const { email } = userResponse.data;
    if (!email) {
      throw new Error('No email found in Google data');
    }

    const { user, token } = await userService.googleLogin({ email });
    if (!user) {
      throw new Error('User not found or could not be created');
    }

    console.log(`User data before response: ${JSON.stringify(user)}`);
    res.status(200).json({
      message: '로그인 성공',
      user,
      token,
    });
  } catch (error) {
    console.error('OAuth 로그인 중 오류 발생', error);
    res.status(500).send('로그인 실패');
  }
};


// 회원가입 리다이렉트 처리
const signupRedirect = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    const { email, name } = userResponse.data;
    let user = await userService.getUserByEmail(email);

    if (!user) {
      user = await userService.createUser({
        email,
        password: 'oauth2password', // 기본 비밀번호 설정, 필요시 사용자로부터 추가 정보 요청 필요
        name: name || '',
        gender: 'unknown', // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        birth: new Date(), // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        user_army_number: 'unknown', // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        user_status_id: 1, // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        phone_number: 'unknown', // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        belonged_unit_id: 1, // 기본 값 설정, 필요시 사용자로부터 추가 정보 요청 필요
        created_at: new Date(),
      });
    }

    res.json({ message: '회원가입 및 로그인 성공', user });
  } catch (error) {
    console.error('OAuth 과정 중 오류 발생', error);
    res.status(500).send('인증 실패');
  }
};

const googleLogin = async (req, res) => {
  try {
    const token = req.query.authorization; // URL 쿼리에서 토큰 추출
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }
    
    // 토큰 검증 및 디코드
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token data: ${JSON.stringify(decoded)}`);

    // 사용자 정보 확인 및 생성
    let user = await userService.getUserByEmail(decoded.email);
    if (!user) {
      user = await userService.createUser({
        email: decoded.email,
        name: decoded.name || 'Unknown',
        password: 'oauth2password'
      });
    }

    // 새로운 토큰 발행
    const newToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 직접 토큰 생성
    console.log(`반환 전 최종 사용자 데이터 확인: ${JSON.stringify(user)}`);

    res.status(200).json({
      message: '로그인 성공',
      user,
      token: newToken,
    });
  } catch (error) {
    console.error(`로그인 처리 중 에러 발생: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  signup,
  loginRedirect,
  signupRedirect,
  googleLogin,
};
