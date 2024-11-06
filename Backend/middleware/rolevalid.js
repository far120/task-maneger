const rolevalid = (req , res , next) => {
    const { role } = req.body;
  if (req.body.email.includes("@adminserver.com"))
        req.body.role = "adminserver";
    else
    req.body.role = "user";
    next();
};

module.exports = {rolevalid};