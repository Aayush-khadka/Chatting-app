import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import Trycatch from "../config/trycatch.js";
import { redisClient } from "../index.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/user.js";

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

  const otpkey = `otp:${email}`;

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

const verifyUser = Trycatch(async (req, res) => {
  const { email, otp: enteredOTP } = req.body;

  if (!email || !enteredOTP) {
    res.status(400).json({
      message: "Email and OTP Required",
    });
    return;
  }

  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== enteredOTP) {
    res.status(400).json({
      message: "OTP Wrong or Expired!!!",
    });
    return;
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  const token = generateToken(user);

  res.json({
    message: "User is verified",
    user,
    token,
  });
});

export const myProfile = Trycatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.json(user);
});
export { loginUser, verifyUser };
