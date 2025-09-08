// express.js 
const { loginUser, refreshUserToken } = require("../services/auth.service");
const admin = require("../config/firebase");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.status(200).json({
      message: "Login successful",
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: {
        id: result.userId,
        email: result.email,
      },
    });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

const me = async (req, res, next) => {
  if (!req.user?.id) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const userRecord = await admin.auth().getUser(req.user.id);
    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    });
  } catch (error) {
    error.statusCode = 404;
    error.message = "User not found";
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const result = await refreshUserToken(refreshToken);
    res.status(200).json({
      message: "Token refreshed successfully",
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      userId: result.userId,
    });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { login, me, refreshToken };
