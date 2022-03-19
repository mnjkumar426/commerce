'use strict';

/**
 * price-range service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::price-range.price-range');
