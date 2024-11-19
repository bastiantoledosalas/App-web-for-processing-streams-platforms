export default () => ({
    PORT: parseInt(process.env.USER_SERVICE_PORT, 10) || 3001,
    database: {
      user: process.env.USER_MONGO || 'bastian',
      port: parseInt(process.env.USER_DATABASE_PORT, 10) || 27018,
      password: process.env.USER_MONGO_PASSWORD,
      mongo_cluster: process.env.USER_MONGO_CLUSTER || 'cluster0.u26nn.mongodb.net',
      mongo_database: process.env.User_MONGO_DATABASE || 'Cluster0'
    }
  });