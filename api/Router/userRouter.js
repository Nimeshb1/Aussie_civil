import express from "express";
import { getdata, postUsers, verifyPost } from "../moodle/moodle.js";
import { comparePassword, haspassword } from "../bcryot/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { adminSignupEmail } from "../verification/verification.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email[0].toUpperCase() + req.body.email.slice(1);
    req.body.email = email;

    const data = await getdata(req.body);

    const compPassword = comparePassword(req.body.password, data.password);
    data.password = undefined;

    if (!data?.validation || data?.verificationCode) {
      res.json({
        status: "error",
        message: "Account is not verified",
      });
      return;
    }
    if (!data?._id) {
      res.json({
        status: "error",
        message: "Wrong Email",
      });
      return;
    }
    if (!compPassword) {
      res.json({
        status: "error",
        message: "Wrong Password",
      });
      return;
    }
    if (data?.validation && !data?.verificationCode && compPassword) {
      res.json({
        status: "success",
        message: "SucessFully Longin",
        data,
      });
      return;
    }
  } catch (error) {
    const message = error.message;
    if (
      message.includes("Cannot read properties of null (reading 'password')")
    ) {
      res.json({
        status: "error",
        message: "Wrong Email and password",
      });
    }
    console.log(error.message);
  }
});
router.post("/reverify", async (req, res, next) => {
  try {
    const email = req.body.email[0].toUpperCase() + req.body.email.slice(1);
    req.body.email = email;
    const data = await getdata(req.body);
    if (data?.validation && !data?.verificationCode) {
      res.json({
        status: "error",
        message: "Email is already verified, Please login",
      });
      return;
    }
    if (!data?._id) {
      res.json({
        status: "error",
        message: "Data not found, please Register",
      });
      return;
    }
    if (data?._id && !data?.validation && data?.verificationCode) {
      const uniqueUrl = `http://localhost:3000/verify?c=${data.verificationCode}&email=${data.email}`;
      adminSignupEmail(data, uniqueUrl);
      res.json({
        status: "success",
        message: "Verification send to you email, Please verify and login",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/", async (req, res, next) => {
  const lowercase =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  try {
    // error handeling
    if (!lowercase.test(req.body.password)) {
      res.json({
        status: "error",
        message: `Error please check error on red text!! `,
      });
      return;
    }
    if (req.body.phone.length !== 10) {
      res.json({
        status: "error",
        message: `Phone number must have 10 digits `,
      });
      return;
    }
    if (req.body.password !== req.body.repassword) {
      res.json({
        status: "error",
        message: "Password does not match",
      });
      return;
    }
    if (req.body.password.length < 8) {
      res.json({
        status: "error",
        message: "Password must contained 8 character",
      });
      return;
    }

    // hass password
    const haspass = haspassword(req.body.password);
    const email = req.body.email[0].toUpperCase() + req.body.email.slice(1);

    if (haspass) {
      req.body.email;
      req.body.password = haspass;
      req.body.email = email;
      // generating verification code
      req.body.verificationCode = uuidv4();
    }
    const data = await postUsers(req.body);

    if (data?._id) {
      //process for the email
      const uniqueUrl = `http://localhost:3000/verify?c=${data.verificationCode}&email=${data.email}`;
      adminSignupEmail(data, uniqueUrl);

      res.json({
        status: "success",
        message: "User has been created",
      });
    } else
      ({
        status: "error",
        message: "Something went Wrong, Please try again",
      });
  } catch (error) {
    const message = error.message;
    // invalid phone
    if (message.includes("Cast to Number failed for value")) {
      res.json({
        status: "error",
        message: "please enter valide phone number",
      });
      return;
    }
    // multiple email entry
    if (
      message.includes(
        "E11000 duplicate key error collection: Aussie_Civil.users index: email_1 dup key:"
      )
    ) {
      res.json({
        status: "error",
        message: "Email has already been, Plsease try using different Email",
      });
      return;
    }
    //multiple email entry
    if (
      message.includes(
        "E11000 duplicate key error collection: Aussie_Civil.users index: phone_1 dup key:"
      )
    ) {
      res.json({
        status: "error",
        message:
          "Phone Number has already been, Plsease try using different Number",
      });
      return;
    }
    // empty form value
    if (message.includes("user validation failed: ")) {
      res.json({
        status: "error",
        message: "Please fill all required * field ",
      });
      return;
    }
    next(error);
  }
});
router.post("/verify", async (req, res, next) => {
  try {
    const obj = {
      verificationCode: "",
      validation: true,
    };
    const data = await verifyPost(req.body, obj);
    if (data?._id) {
      res.json({
        status: "success",
        message: "Email verified",
      });
      return;
    }
    res.json({
      status: "error",
      message: "Invalid link",
    });
  } catch (error) {}
});

router.delete("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Sucessfully updated",
  });
});

export default router;
