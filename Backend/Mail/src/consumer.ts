import amqp from "amqplib";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const startSendOTPConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();

    const queuename = "send-otp";

    await channel.assertQueue(queuename, { durable: true });
    console.log("✅ MAILSERVICE CONSUMER STARTED , LISTNING FOR OTP EMAILS");

    channel.consume(queuename, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            },
          });

          await transporter.sendMail({
            from: "Chat-app",
            to,
            subject,
            text: body,
          });
          console.log(`OTP MAIL SEND TO ${to}`);
          channel.ack(msg);
        } catch (error) {
          console.log("FAILED TO SEND OTP", error);
        }
      }
    });
  } catch (error) {
    console.log("ERROR IN STARTING RABBITMQ CONSUMER", error);
  }
};
