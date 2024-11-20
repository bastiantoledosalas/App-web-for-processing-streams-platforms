export default () => {
    const user = process.env.USER_MONGO || 'bastian';
    const password = process.env.USER_MONGO_PASSWORD;
    const cluster = process.env.USER_MONGO_CLUSTER || 'cluster0.u26nn.mongodb.net';
    const database_name = process.env.USER_MONGO_DATABASE || 'Cluster0';
    const rabbitmq_user = process.env.RABBITMQ_DEFAULT_USER;
    const rabbitmq_pass= process.env.RABBITMQ_DEFAULT_PASS;
    const rabbitmq_url = process.env.RABBITMQ_URL;
   
     return {
      PORT: parseInt(process.env.SIMULATION_SERVICE_PORT, 10) || 3002,
      database: {
        user,
        port: parseInt(process.env.USER_DATABASE_PORT, 10) || 27017,
        password,
        mongo_cluster: cluster,
        mongo_database: database_name,
        uri: `mongodb+srv://${user}:${password}@${cluster}/${database_name}?retryWrites=true&w=majority`
      },
      rabbitmq: {
        rabbitmq_user: rabbitmq_user,
        rabbitmq_pass: rabbitmq_pass,
        rabbitmq_url: rabbitmq_url
      }
    };
  };