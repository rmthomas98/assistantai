const nodemailer = require("nodemailer");

const handler = async (req, res) => {
  try {
    const { name, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      port: 587,
      auth: {
        user: "rmthomas1998@gmail.com",
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const msg = {
      from: "'AssistantAI' <rmthomas1998@gmail.com>",
      to: "rmthomas1998@gmail.com",
      subject: "New Feedback for AssistantAI",
      text: `New feedback from ${name}: ${message}`,
    };

    try {
      await transporter.sendMail(msg);
      res.send("success");
    } catch {
      res.status(500).send("Server Error");
    }
  } catch {
    res.status(500).send("Server Error");
  }
};

export default handler;
