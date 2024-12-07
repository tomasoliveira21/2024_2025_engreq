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
        const subscriptions = [];

        // Generate orders and subscriptions
        consumers.forEach((consumer) => {
            const singlePurchaseOrder = {
                consumerId: consumer.id,
                periodType: periodType.single_purchase,
                totalCost: Math.random() * 100 + 50, // Random total cost between 50 and 150
                paidCost: Math.random() * 50 + 20, // Random paid cost between 20 and 70
                orderDate: currentDate,
                status: status.pending,
                createdAt: currentDate,
                updatedAt: currentDate,
            };
            orders.push(singlePurchaseOrder);

            const monthlySubscription = {
                startDate: currentDate,
                endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()),
                createdAt: currentDate,
                updatedAt: currentDate,
            };
            subscriptions.push(monthlySubscription);

            const weeklySubscription = {
                startDate: currentDate,
                endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7),
                createdAt: currentDate,
                updatedAt: currentDate,
            };
            subscriptions.push(weeklySubscription);
        });

        // Insert subscriptions and get their IDs
        const insertedSubscriptions = await queryInterface.bulkInsert(
            tables.Subscriptions,
            subscriptions,
            { returning: true }
        );

        // const insertedSubscriptions = await queryInterface.sequelize.query(
        //     `SELECT id FROM "${tables.Subscriptions}" ORDER BY createdAt DESC LIMIT ${subscriptions.length};`,
        //     { type: QueryTypes.SELECT }
        // );

        // Map subscriptions to orders
        consumers.forEach((consumer, index) => {
            const subscriptionOffset = index * 2; // Each consumer gets 2 subscriptions

            orders.push(
                {
                    consumerId: consumer.id,
                    periodType: periodType.monthly,
                    totalCost: Math.random() * 200 + 100, // Random total cost between 100 and 300
                    paidCost: Math.random() * 150 + 50, // Random paid cost between 50 and 200
                    orderDate: currentDate,
                    status: status.completed,
                    subscriptionId: insertedSubscriptions[subscriptionOffset].id, // Reference subscription
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
                {
                    consumerId: consumer.id,
                    periodType: periodType.weekly,
                    totalCost: Math.random() * 80 + 40, // Random total cost between 40 and 120
                    paidCost: Math.random() * 60 + 10, // Random paid cost between 10 and 70
                    orderDate: currentDate,
                    status: status.cancelled,
                    subscriptionId: insertedSubscriptions[subscriptionOffset + 1].id, // Reference subscription
                    createdAt: currentDate,
                    updatedAt: currentDate,
                }
            );
        });

        // Bulk insert orders into the Order table
        await queryInterface.bulkInsert(tables.Orders, orders);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(tables.Orders, null, {});
        await queryInterface.bulkDelete(tables.Subscriptions, null, {});
    },
};
