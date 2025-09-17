const checkPremium = (req, res, next) => {
  if (!req.user || req.user.plan !== "premium") {
    return res.status(403).json({ message: "Upgrade to premium to access this feature" });
  }
  next();
};

export default checkPremium;
