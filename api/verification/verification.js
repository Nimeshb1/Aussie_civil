import nodemailer from "nodemailer";

const emailProcessing = async (emaiinfo) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: process.env.newPort,
      credentials: "",
      secure: false, // `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });

    const info = await transporter.sendMail(emaiinfo);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

// async..await is not allowed in global scope, must use a wrapper
export const adminSignupEmail = async ({ email, fname, lname }, uniqueUrl) => {
  try {
    // send mail with defined transport object
    let secinfo = {
      from: `Aussie Civil <${process.env.Email}`,
      to: `${email}`, // list of receivers
      subject: `Verification mail `, // Subject line
      text: `Hi ${fname} ${lname}, * Please donot reply to this email * Your have sucessfully created an Account. We have send you a verification Link. Please veryfy your account to continuted. ${uniqueUrl}`,
      html: `<b>Hi  ${fname} ${lname},</b> 
      <p><p>
    <b style='color:red' > * Please donot reply to this email *</b>
      <p>Your have sucessfully created an Account. We have send you a verification Link, Please verify your account to continuted. </P? 
      <p></P>
      <p></P>
      <a href=${uniqueUrl} style:"color:blue">Verify Now</a>
      <p></P>
      <p></P>
      <p></P>
      Thank you
      <p></P>
      Aussie Civil
      `, // html body
    };

    emailProcessing(secinfo);
  } catch (error) {
    console.log(error);
  }
};
