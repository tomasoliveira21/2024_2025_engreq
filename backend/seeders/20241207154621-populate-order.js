'use strict';

/** @type {import('sequelize-cli').Migration} */
const { QueryTypes } = require('sequelize');
const { status, tables, periodType } = require("../src/utils/Constants");

module.exports = {
    async up(queryInterface, Sequelize) {
        const consumers = await queryInterface.sequelize.query(
            `SELECT id FROM "Consumers";`,
            {
                type: QueryTypes.SELECT,
            }
        );

        const currentDate = new Date();
        const orders = [];

        // Generate orders (single purchase, monthly, weekly)
        consumers.forEach((consumer) => {
            // Single purchase order
            orders.push({
                consumerId: consumer.id,
                periodType: periodType.single_purchase,
                totalCost: Math.random() * 100 + 50, // Random total cost between 50 and 150
                paidCost: Math.random() * 50 + 20, // Random paid cost between 20 and 70
                orderDate: currentDate,
                status: status.pending,
                createdAt: currentDate,
                updatedAt: currentDate,
            });

            // Monthly order
            orders.push({
                consumerId: consumer.id,
                periodType: periodType.monthly,
                totalCost: Math.random() * 200 + 100, // Random total cost between 100 and 300
                paidCost: Math.random() * 150 + 50, // Random paid cost between 50 and 200
                orderDate: currentDate,
                status: status.completed,
                createdAt: currentDate,
                updatedAt: currentDate,
            });

            // Weekly order
            orders.push({
                consumerId: consumer.id,
                periodType: periodType.weekly,
                totalCost: Math.random() * 80 + 40, // Random total cost between 40 and 120
                paidCost: Math.random() * 60 + 10, // Random paid cost between 10 and 70
                orderDate: currentDate,
                status: status.cancelled,
                createdAt: currentDate,
                updatedAt: currentDate,
            });
        });

        // Bulk insert orders into the Orders table
        await queryInterface.bulkInsert(tables.Orders, orders);

        // Retrieve inserted orders with periodType != 'single_purchase'
        const nonSinglePurchaseOrders = await queryInterface.sequelize.query(
            `SELECT id, "periodType" FROM "${tables.Orders}" WHERE "periodType" != '${periodType.single_purchase}';`,
            {
                type: QueryTypes.SELECT,
            }
        );

        // // Map orders to subscriptions
        // const subscriptions = nonSinglePurchaseOrders.map((order) => {
        //     const startDate = new Date();
        //     let endDate;
        //
        //     // Calculate endDate based on periodType
        //     if (order.periodType === periodType.weekly) {
        //         endDate = new Date(startDate);
        //         endDate.setDate(startDate.getDate() + 7); // Add 7 days
        //     } else if (order.periodType === periodType.monthly) {
        //         endDate = new Date(startDate);
        //         endDate.setDate(startDate.getDate() + 30); // Add 30 days
        //     }
        //
        //     return {
        //         orderId: order.id,
        //         createdAt: currentDate,
        //         updatedAt: currentDate,
        //         startDate: startDate,
        //         endDate: endDate,
        //     };
        // });
        //
        // // Bulk insert subscriptions into the Subscriptions table
        // await queryInterface.bulkInsert(tables.Subscriptions, subscriptions);
    },

    async down(queryInterface, Sequelize) {
        // Remove inserted data
        await queryInterface.bulkDelete(tables.Subscriptions, null, {});
        await queryInterface.bulkDelete(tables.Orders, null, {});
    },
};
