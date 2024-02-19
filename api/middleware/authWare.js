import { getUser } from "../moodle/moodle.js";

export const authWare = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const user = authorization ? await getUser({ _id: authorization }) : null;

    user?._id
      ? next()
      : res.json({
          status: "error",
          message: "Unauthorized!!! Please login ",
        });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
