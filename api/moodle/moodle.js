import userSchama from "../schama/userSchama.js";

// modle for users
export const postUsers = (obj) => {
  return userSchama(obj).save();
};
export const verifyPost = (filter, obj) => {
  return userSchama.findOneAndUpdate(filter, obj, { new: true });
};
export const getdata = ({ email }) => {
  return userSchama.findOne({ email });
};
