import sendEmail from "../helpers/email.helper.js";

const sendEmailCb = async (req, res) => {
  const { email } = req.params;
  await sendEmail(email);
  res.json200("ok");
};
export {sendEmailCb};