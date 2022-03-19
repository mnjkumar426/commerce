module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/orders/chekout',
        handler: 'order.checkout',
        config: {
          auth: false,
        },
      },
    ],
  };