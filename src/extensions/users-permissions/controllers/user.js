module.exports = {
    /**
     * Create a/an user record.
     * @return {Object}
     */
    async create(ctx) {
        try {
            
        console.log("ctx",ctx)
      const advanced = await strapi
        .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
        .get();
  
      await validateCreateUserBody(ctx.request.body);
  
      const { email, username, role } = ctx.request.body;
  
      const userWithSameUsername = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { username } });
  
      if (userWithSameUsername) {
        if (!email) throw new ApplicationError('Username already taken');
      }
  
      if (advanced.unique_email) {
        const userWithSameEmail = await strapi
          .query('plugin::users-permissions.user')
          .findOne({ where: { email: email.toLowerCase() } });
  
        if (userWithSameEmail) {
          throw new ApplicationError('Email already taken');
        }
      }
  
      const user = {
        ...ctx.request.body,
        provider: 'local',
      };
  
      user.email = _.toLower(user.email);
  
      if (!role) {
        const defaultRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: advanced.default_role } });
  
        user.role = defaultRole.id;
      }
  
      try {
        const data = await getService('user').add(user);
        const sanitizedData = await sanitizeOutput(data, ctx);
  
        ctx.created(sanitizedData);
      } catch (error) {
        throw new ApplicationError(error.message);
      }
    }
catch(e){
    console.log("errrro");

}
    }
}


