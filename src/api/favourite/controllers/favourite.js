'use strict';

/**
 *  favourite controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::favourite.favourite',({strapi})=>({

    async create(ctx) {
       let user=ctx.state.user;
       let body =ctx.request.body;

    let entry;
       let fav=await strapi.db.query('api::favourite.favourite').findOne({where:{userId:user.id,productId:body.productId}})
        if(fav){
             entry = await strapi.db.query('api::favourite.favourite').delete({
                where: { userId:user.id,productId:body.productId},
              });
              //console.log("entry",entry)
               
        }else{
             entry = await strapi.entityService.create('api::favourite.favourite', {
                data: {...body,userId:user.id}
              });
               
        }
        
      
        return {data:entry};
      },
      async find(ctx) {
        let user=ctx.state.user;
        const entries = await strapi.db.query('api::favourite.favourite').findMany( {   
            where: { userId: user.id },
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
        
    
        const entry = await strapi.db.query('api::favourite.favourite').delete({
            where: { userId:user.id,id:id},
          });
        //console.log("entity",entry)
        
    
        return {status:true}
      }
    
}



));
