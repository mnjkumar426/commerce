module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f42a54f178f1154e9664901e071bf02b'),
  },
});
