const axios = require('axios');
const userService = require('../services/userService');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_LOGIN_REDIRECT_URI,
  GOOGLE_SIGNUP_REDIRECT_URI,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} = require('../config/oauth');

const login = (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
};

const signup = (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
};

const loginRedirect = async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const { email, name } = userResponse.data;

    const { user, token } = await userService.googleLogin({ email, name }); // 추가: 구글 로그인 후 사용자 생성 및 토큰 발급

    res.json({ user, token });
  } catch (error) {
    console.error('OAuth 과정 중 오류 발생', error);
    res.status(500).send('인증 실패');
  }
};


const signupRedirect = async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  try {
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const { email, name } = userResponse.data;

    const { user, token } = await userService.googleLogin({ email, name }); // 추가: 구글 로그인 후 사용자 생성 및 토큰 발급

    res.json({ user, token });
  } catch (error) {
    console.error('OAuth 과정 중 오류 발생', error);
    res.status(500).send('인증 실패');
  }
};

const googleLogin = async (req, res) => {
  try {
    const googleUserData = req.body; // 프론트엔드에서 구글 OAuth로 받아온 사용자 데이터

    const { user, token } = await userService.googleLogin(googleUserData);

    res.status(200).json({
      message: '로그인 성공',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  signup,
  loginRedirect,
  signupRedirect,
  googleLogin
};
