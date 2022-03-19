'use strict';

/**
 *  cart controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cart.cart',({strapi})=>({

    async create(ctx) {
       let user=ctx.state.user;
       let body =ctx.request.body;

    let entry;
       let cart=await strapi.db.query('api::cart.cart').findOne({where:{users_permissions_user:user.id,product:body.product}})
        if(cart){
             entry = await strapi.entityService.update('api::cart.cart', cart.id, {
                data: body
              });
              //console.log("entry",entry)
               
        }else{
             entry = await strapi.entityService.create('api::cart.cart', {
                data: {...body,users_permissions_user:user.id}
              });
               
        }
        
      
        return {data:entry};
      },
      async find(ctx) {
        let user=ctx.state.user;
        const entries = await strapi.db.query('api::cart.cart').findMany( {   
            where: { users_permissions_user: user.id },
            populate: {
                product:{
                    populate:{
                        image:true,
                        images:true
                    }
                }
                
            },

          });

    
        return { data:entries };
      },
      async delete(ctx) {
        const { id } = ctx.params;
        let user=ctx.state.user;
        console.log("id",id,user)
        
    
        const entry = await strapi.db.query('api::cart.cart').delete({
            where: { users_permissions_user:user.id,id:id},
          });
        //console.log("entity",entry)
        
    
        return {status:true}
      }
    
}



)


);
