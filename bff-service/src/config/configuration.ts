export default () => {
    const rabbitmq_user = process.env.RABBITMQ_DEFAULT_USER;
    const rabbitmq_pass= process.env.RABBITMQ_DEFAULT_PASS;
    const rabbitmq_url = process.env.RABBITMQ_URL;
   
     return {
      PORT: parseInt(process.env.BFF_SERVICE_PORT, 10),
      rabbitmq: {
        rabbitmq_user: rabbitmq_user,
        rabbitmq_pass: rabbitmq_pass,
        rabbitmq_url: rabbitmq_url
      }
    };
  };