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

module.exports = { loginUser };