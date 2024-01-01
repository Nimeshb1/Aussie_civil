import bcrypt from "bcrypt";

const saltRound = 10;

export const haspassword = (plainpassword) => {
  return bcrypt.hashSync(plainpassword, saltRound);
};
