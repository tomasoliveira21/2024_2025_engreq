import React from "react";
import { Subscription } from "@/types/order";
import { HistoryS } from "@/types/historyS";

type OrderCardProps = {
  order: Subscription | HistoryS;
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-blue-500">
          Order #{order.id} - {order.periodType?.toUpperCase()}
        </h2>
        <p className="text-sm text-gray-400">
          Date: {new Date(order.orderDate).toLocaleDateString()} | Status:{" "}
          <span
            className={`${
              order.status === "completed"
                ? "text-green-500"
                : "text-yellow-500"
            } font-medium`}
          >
            {order.status}
          </span>
        </p>
        <p className="text-sm text-gray-400">
          Total Cost: {order.totalCost?.toFixed(2)} EUR | Paid:{" "}
          {order.paidCost?.toFixed(2)} EUR
        </p>
      </div>
      <div className="space-y-4">
        {order.OrderDetails?.map((detail) => (
          <div
            key={detail.id}
            className="p-3 border rounded-lg bg-gray-900"
          >
            <h3 className="text-lg font-semibold text-yellow-400">
              {detail.itemType === "product"
                ? detail.Product?.name
                : detail.Basket?.name}
            </h3>
            <p className="text-sm text-gray-300">
              Quantity: {detail.quantity} | Price: {detail.price?.toFixed(2)} EUR
            </p>
            {detail.itemType === "product" && detail.Product && (
              <p className="text-sm text-gray-400">
                Description: {detail.Product.description}
              </p>
            )}
            {detail.itemType === "basket" && detail.Basket && (
              <>
                <p className="text-sm text-gray-400">
                  Description: {detail.Basket.description}
                </p>
                <p className="text-sm text-gray-400">
                  Weight: {detail.Basket.weight}kg
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Products in Basket:</p>
                  <ul className="list-disc list-inside text-gray-400">
                    {detail.Basket.Products.map((product) => (
                      <li key={product.id}>
                        {product.name} - {product.price.toFixed(2)} EUR
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
