import { publishToQueue } from "../config/rabbitmq.js";
import Trycatch from "../config/trycatch.js";
import { redisClient } from "../index.js";

const loginUser = Trycatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit;${email}`;

  const ratelimit = await redisClient.get(rateLimitKey);
  if (ratelimit) {
    res.status(429).json({
      message: "TOO many requests.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpkey = `otp: ${email}`;

  await redisClient.set(otpkey, otp, {
    EX: 300,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "YOUR OTP CODE",
    body: `Your OTP IS ${otp}.This will Expire in 5 mins`,
  };

  await publishToQueue("send-otp", message);
  res.status(200).json({
    message: "Otp send to your Email",
  });
});

export default loginUser;
