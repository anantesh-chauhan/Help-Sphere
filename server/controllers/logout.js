const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,         // set to true in production with HTTPS
      sameSite: 'lax'        // match sameSite policy with login
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    next(error);
  }
};

module.exports = logout;
