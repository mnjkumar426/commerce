
const  speakeasy = require("speakeasy");
const utils = require('@strapi/utils');
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return utils.sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {

  plugin.routes['content-api'].routes.push(   {
    "method": "POST",
    "path": "/users/check",
    "handler": "user.checkSignUp",
    "config": {
      "prefix": ""
    }
  },
  {
    "method": "POST",
    "path": "/users/signUp",
    "handler": "user.signUp",
    "config": {
      "prefix": ""
    }
  },
  {
    "method": "POST",
    "path": "/users/login",
    "handler": "user.login",
    "config": {
      "prefix": ""
    }
  },
  {
    "method": "POST",
    "path": "/users/otp",
    "handler": "user.otp",
    "config": {
      "prefix": ""
    }
  },
  {
    "method": "POST",
    "path": "/users/verify",
    "handler": "user.verify",
    "config": {
      "prefix": ""
    }
  }
  
  
  )
  console.log(plugin)
    plugin.controllers.user.checkSignUp = async (ctx) => {
        console.log(ctx)
try {

    const { username } = ctx.request.body;
        const user = await strapi
          .query('plugin::users-permissions.user')
          .findOne({ where: { mobile:  username} });
          if(user && user.confirmed){
            console.log(user)
            return  ctx.badRequest('Mobile  already registered',{isRegister:true});

          }
      if(!user || (user && !user.confirmed )) {
        var secret = speakeasy.generateSecret({length: 20});
        var token = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',   
           
        });
        let data;
        if(user && !user.confirmed){

            data = await strapi.plugins['users-permissions'].services.user.edit(user.id,{otp:secret.base32});
        }else{
            data = await strapi.plugins['users-permissions'].services.user.add({mobile:username,username:username,otp:secret.base32});
        }
        if(data){
            return {status:true,"message":"Otp send to your mobile",otp:token}
        }
      } 

      
    
} catch (error) {
    //console.log("error",JSON.stringify(error))
    throw new Error(error.message);
    
}
        


  }

plugin.controllers.user.signUp = async (ctx) => {
   // console.log(ctx)
try {



const { username,otp,password } = ctx.request.body;
if(!(username && otp && password)){
  return   ctx.badRequest('username/password,otp are requried');
}
    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { mobile:  username} });
      if(user && user.confirmed){
        return  ctx.badRequest('Mobile  already registered',{isRegister:true});
      }
  if(!user || (user && !user.confirmed )) {

    let data;
    if(user && !user.confirmed){

      var tokenValidates = speakeasy.totp.verify({
        secret: user.otp,
        encoding: 'base32',
        token: otp,  
       window:10
      });
      if(!tokenValidates){
        return  ctx.badRequest('Otp Invalid or OTP expired');
      }

        data = await strapi.plugins['users-permissions'].services.user.edit(user.id,{confirmed:true,password:password});
        if(data){
         // const sanitizedUser = await sanitizeUser(user, ctx);

     return{
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      }

        }else{
          throw new Error("Someting went wrong") 
        }
    }else{
      return  ctx.badRequest('Mobile number not regester',{isRegister:false}); 
    }
    
 } 
} catch (error) {
//console.log("error",JSON.stringify(error))
throw new Error(error.message);

}
    


};
plugin.controllers.user.login = async (ctx) => {
  // console.log(ctx)
try {
  console.log("ctx.request.headers",ctx.request.headers)
  let palinAuth=new Buffer(ctx.request.headers.authorization.split(" ")[1], 'base64').toString()
  let auth=palinAuth.split(/:(.+)/);
  let username=auth[0]
  let password=auth[1]
  const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { mobile:  username,confirmed:true} });
      if(user){

        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
          password,
          user.password
        );
        if(validPassword){
          return{
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
            user: await sanitizeUser(user, ctx),
          } 
        }
      else{
        return  ctx.badRequest('Invalid Password',{isRegister:true});

      }
    }else{
      return  ctx.badRequest('Mobile number not register',{isRegister:false});
    }

} catch (error) {
//console.log("error",JSON.stringify(error))
throw new Error(error.message);

}

};
plugin.controllers.user.otp = async (ctx) => {
  // console.log(ctx)
try {
  
  const { username } = ctx.request.body;
  const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { mobile:  username,confirmed:true} });
      if(user){

        var secret = speakeasy.generateSecret({length: 20});
        var token = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',   
           
        });
      let  data = await strapi.plugins['users-permissions'].services.user.edit(user.id,{otp:secret.base32});
      if(data){
        return {otp:token}
      }else{
        return  ctx.badRequest('error');
      }
        
    }else{
      return  ctx.badRequest('Mobile number not register',{isRegister:false});
    }

} catch (error) {
//console.log("error",JSON.stringify(error))
throw new Error(error.message);

}

};

plugin.controllers.user.verify = async (ctx) => {
  // console.log(ctx)
try {



const { username,otp } = ctx.request.body;
   const user = await strapi
     .query('plugin::users-permissions.user')
     .findOne({ where: { mobile:  username} });
     
 if(user &&user.confirmed ) {

     var tokenValidates = speakeasy.totp.verify({
       secret: user.otp,
       encoding: 'base32',
       token: otp,  
      window:10
     });
     if(!tokenValidates){
       return  ctx.badRequest('Otp Invalid or OTP expired');
     }
   

    return{
       jwt: strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }),
       user: await sanitizeUser(user, ctx),
     }


   }else{
     return  ctx.badRequest('Mobile number not regester',{isRegister:false}); 
   }
   
} catch (error) {
//console.log("error",JSON.stringify(error))
throw new Error(error.message);

}
   


};

  
    return plugin;
  };