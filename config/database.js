module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '192.168.64.2'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'demo_1'),
      user: env('DATABASE_USERNAME', 'mnj'),
      password: env('DATABASE_PASSWORD', 'mnj'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
