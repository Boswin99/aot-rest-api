const axios = require("axios");

const loginUser = async (email, password) => {
  try {
    const apiKey = process.env.FIREBASE_API_KEY; // from Firebase project settings
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    return {
      idToken: response.data.idToken, // short-lived JWT
      refreshToken: response.data.refreshToken, // long-lived
      expiresIn: response.data.expiresIn,
      userId: response.data.localId,
      email: response.data.email,
    };
  } catch (error) {
    console.error("Firebase login error:", error.response?.data || error.message);
    throw new Error("Invalid email or password");
  }
};

const refreshUserToken = async (refreshToken) => {
  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    const url = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;

    const response = await axios.post(url, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    return {
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      userId: response.data.user_id,
    };
  } catch (error) {
    console.error("Firebase refresh token error:", error.response?.data || error.message);
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = { loginUser, refreshUserToken };
