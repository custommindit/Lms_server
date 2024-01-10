const verifyAdminSecret = (req, res, next) => {
  const adminSecret = req.headers['x-admin-secret'];

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({
      success: 0,
      message: "Access Denied: Invalid or missing admin secret key."
    });
  }
  next();
};

module.exports = verifyAdminSecret;
