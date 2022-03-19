
const { createCoreController } = require('@strapi/strapi').factories;
const axios =require("axios");
module.exports = createCoreController('api::order.order',({strapi})=>({


    async checkout(ctx) {
        // const response = await node_fetch('https://sandbox.cashfree.com/pg/orders', {
        //     method: 'post',
        //     body: JSON.stringify({
        //         "order_id": "order_1626945143520",
        //         "order_amount": 10.12,
        //         "order_currency": "INR",
        //         "customer_details": {
        //           "customer_id": "12345",
        //           "customer_email": "techsupport@bs.com",
        //           "customer_phone": "9168532596"
        //         }
        //       }),
        //     headers: {'Content-Type': 'application/json', 
        //     'x-client-id': '13876088b848cf47d4a96c1f1a067831', 
        //     'x-client-secret': '7f1fa303a1cb192e3f271c8e7d693e4c9d8a9ce0'}
        // });
        // const data = await response.json();

        let data = JSON.stringify({
            "order_id": "order_1626945143520",
            "order_amount": 10.12,
            "order_currency": "INR",
            "customer_details": {
              "customer_id": "12345",
              "customer_email": "techsupport@cashfree.com",
              "customer_phone": "9816512345"
            }
          });
          
          var config = {
            method: 'post',
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: { 
              'Content-Type': 'application/json', 
              'x-api-version': '2022-01-01', 
              'x-client-id': '13876088b848cf47d4a96c1f1a067831', 
              'x-client-secret': '7f1fa303a1cb192e3f271c8e7d693e4c9d8a9ce0'
            },
            data : data
          };
          try {
          let d=await axios(config)
           return{data:d.data}
          } catch (error) {
              console.log("Errror",error)
              return{data:error.toJSON()}
              
          }
         
        
         
        
        

        },

        async create(ctx) {



            return {status:true}   
        }

//     async create(ctx) {
//        let user=ctx.state.user;
//        let body =ctx.request.body;

//     let entry;
//        let cart=await strapi.db.query('api::cart.cart').findOne({where:{users_permissions_user:user.id,product:body.product}})
//         if(cart){
//              entry = await strapi.entityService.update('api::cart.cart', cart.id, {
//                 data: body
//               });
//               //console.log("entry",entry)
               
//         }else{
//              entry = await strapi.entityService.create('api::cart.cart', {
//                 data: {...body,users_permissions_user:user.id}
//               });
               
//         }
        
      
//         return {data:entry};
//       },
//       async find(ctx) {
//         let user=ctx.state.user;
//         const entries = await strapi.db.query('api::cart.cart').findMany( {   
//             where: { users_permissions_user: user.id },
//             populate: {
//                 product:{
//                     populate:{
//                         image:true,
//                         images:true
//                     }
//                 }
                
//             },

//           });

    
//         return { data:entries };
//       },
//       async delete(ctx) {
//         const { id } = ctx.params;
//         let user=ctx.state.user;
//         console.log("id",id,user)
        
    
//         const entry = await strapi.db.query('api::cart.cart').delete({
//             where: { users_permissions_user:user.id,id:id},
//           });
//         //console.log("entity",entry)
        
    
//         return {status:true}
//       }
    
 }



)


);
