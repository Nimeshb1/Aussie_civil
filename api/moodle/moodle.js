import userSchama from "../schama/userSchama.js";

// modle for users
export const postUsers = (obj) => {
  return userSchama(obj).save();
};
