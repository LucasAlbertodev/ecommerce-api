import User from "../model/User.js";
const isAdmin = async (req, res, next) => {
  //find the login user
  const user = await User.findById(req.userAuthId);
  //check if user is admin
  if (!user?.isAdmin) {
    throw new Error("Unauthorized access, only admin can perform this action");
  }
  next();
};

export default isAdmin;
