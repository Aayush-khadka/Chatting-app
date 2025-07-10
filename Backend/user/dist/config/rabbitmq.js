import amqp from "amqplib";
let channel;
export const connectRabbitmq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOSTNAME,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
        });
        channel = await connection.createChannel();
        console.log("✅ CONNECTED TO RABBITMQ!!");
    }
    catch (error) {
        console.log("Failed To connect to rabbitmq", error);
    }
};
export const publishToQueue = async (queuname, message) => {
    if (!channel) {
        console.log("Rabbitmq channel is not initialized!!!!");
        return;
    }
    await channel.assertQueue(queuname, { durable: true });
    channel.sendToQueue(queuname, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
};
