import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/order').then((response) => {
      setOrders(response.data);
    });
  }, []);

  const calculateTotalPrice = (line_items, dollarBluePrice) => {
    return line_items.reduce((total, item) => {
      if (item.coin === "USD") {
        return total + item.total * dollarBluePrice;
      } else {
        return total + item.total;
      }
    }, 0);
  };

  const calculateGainPrice = (line_items, dollarBluePrice) => {
    return line_items.reduce((total, item) => {
      if (item.coin === "USD") {
        return total + item.total * dollarBluePrice - item.reprice * dollarBluePrice;
      } else {
        return total + item.total - item.reprice;
      }
    }, 0);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      {orders.length > 0 &&
        orders.map((order, index) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Order #{index + 1}</h2>
                <h3 className="text-gray-600 mb-2">Id: {order._id}</h3>
                <h3 className="text-md font-medium mb-2">By: {order.name}</h3>
                <h3 className="text-md font-medium mb-2">Email: {order.email}</h3>
                <h3 className="text-md font-medium mb-2">Dollar Price: ${order.dollarBluePrice}</h3>
              </div>
              <div>
                <h3 className="text-md font-medium mb-2">Country: {order.country}</h3>
                <h3 className="text-md font-medium mb-2">Address: {order.address}</h3>
                <h3 className="text-md font-medium mb-2">City: {order.city}</h3>
                <h3 className="text-gray-600 mb-2">Zip Code: {order.zip}</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 pr-40">Product</th>
                    <th className="py-2 pr-18">Quantity</th>
                    <th className="py-2 pr-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.line_items &&
                    order.line_items.map((product) => (
                      <tr key={product.id}>
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 pl-44">{product.quantity}</td>
                        <td className="py-2 pl-44">
                          ${product.coin === "USD" ? product.total * order.dollarBluePrice : product.total}
                        </td>
                      </tr>
                    ))}
                  <tr className="font-semibold bg-colWolf">
                    <td className="py-2 px-4 text-blue-500"></td>
                    <td className="py-2 px-4 text-bgWolf">TOTAL</td>
                    <td className="py-2 pl-44 text-bgWolf">${calculateTotalPrice(order.line_items, order.dollarBluePrice)}</td>
                  </tr>
                  <tr className="font-semibold bg-colWolf">
                    <td className="py-2 px-4 text-bgWolf"></td>
                    <td className="py-2 px-4 text-bgWolf">GANANCIA</td>
                    <td className="py-2 pl-44 text-blue-500">
                      ${calculateGainPrice(order.line_items, order.dollarBluePrice)}{' - '}
                      ({((calculateGainPrice(order.line_items, order.dollarBluePrice) / calculateTotalPrice(order.line_items, order.dollarBluePrice)) * 100).toFixed(2)}%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Orders;
