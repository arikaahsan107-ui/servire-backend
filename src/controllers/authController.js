const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema
} = require("../validators/authValidator");

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "your_super_secret_jwt_access_key_12345";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your_super_secret_jwt_refresh_key_12345";

// ---------------- TOKENS ----------------
const signAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d" }
  );
};

// ---------------- REGISTER ----------------
const register = async (req, res, next) => {
  try {
    console.log("REGISTER BODY:", req.body); // DEBUG

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const {
      name,
      email,
      password,
      phone,
      role,
      skill,
      experience,
      bio
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email address"
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "user",
      skill,
      experience,
      bio,
      verificationToken
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    console.log(
      `[EMAIL DISPATCH] Verification link: http://localhost:5000/api/auth/verify-email/${verificationToken}`
    );

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- LOGIN ----------------
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- LOGOUT ----------------
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// ---------------- REFRESH TOKEN ----------------
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid token owner"
      });
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });
  }
};

// ---------------- FORGOT PASSWORD ----------------
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide an email address"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If email exists, reset link sent"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    console.log(
      `[RESET LINK] http://localhost:5000/api/auth/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Reset link generated"
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- RESET PASSWORD ----------------
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const { error } = resetPasswordSchema.validate({ password });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- VERIFY EMAIL ----------------
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).send(`
      <div style="text-align:center;font-family:sans-serif;padding:40px">
        <h1>Email Verified 🎉</h1>
        <p>You can now login</p>
      </div>
    `);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail
};