import express from "express";
import { postUsers } from "../moodle/moodle.js";
import { haspassword } from "../bcryot/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { adminSignupEmail } from "../verification/verification.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Sucessfully fatch",
  });
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
    console.log(email);
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
router.patch("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Sucessfully updated",
  });
});
router.delete("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Sucessfully updated",
  });
});

export default router;
