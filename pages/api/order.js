import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import axios from "axios";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'POST') {
    try {
      // Obtén el valor del dólar
      const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
      const dollarBluePrice = response.data.venta;

      // Crea la nueva orden con el valor del dólar
      const newOrder = new Order({
        ...req.body,
        dollarBluePrice,
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else if (req.method === 'GET') {
    // Obtiene las órdenes ordenadas por fecha de creación
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
