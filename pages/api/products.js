import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'POST') {
    const { title, description, price, images, category,details, brand, gender, sizes, cantidad } = req.body;

    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      details,
      brand, gender, sizes, cantidad
    })

    res.json(productDoc);
  }

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {

      res.json(await Product.find());
    }
  }

  if (method === 'PUT') {
    const { title, description, price, _id, images, category,details, brand, gender, sizes, colors } = req.body;
    await Product.updateOne({ _id }, {
      title, description, price, images, category,details, brand, gender, sizes, colors
    });
    res.json(true);
  }

  // if (method === 'PATCH') {
  //   const { id, cantidad } = req.body;
  
  //   try {
  //     // Buscar el producto en la base de datos por su ID
  //     const product = await Product.findById(id);
  
  //     if (!product) {
  //       // Si no se encuentra el producto, responder con un error 404
  //       return res.status(404).json({ error: 'Product not found' });
  //     }
  
  //     // Actualizar la cantidad del producto según la acción
  //     if (cantidad !== undefined && typeof cantidad === 'number') {
  //       // Si se proporciona una cantidad válida, actualizarla
  //       if (cantidad > 0) {
  //         // Si la cantidad es positiva, se agrega al stock actual
  //         product.cantidad += cantidad;
  //       } else if (cantidad < 0 && product.cantidad >= Math.abs(cantidad)) {
  //         // Si la cantidad es negativa y hay suficiente stock, se resta del stock actual
  //         product.cantidad -= Math.abs(cantidad);
  //       } else {
  //         // Si la cantidad es negativa y no hay suficiente stock, se responde con un error
  //         return res.status(400).json({ error: 'Insufficient stock' });
  //       }
  //     } else {
  //       // Manejar el caso cuando la cantidad no es válida
  //       return res.status(400).json({ error: 'Invalid quantity' });
  //     }
  
  //     // Guardar los cambios en la base de datos
  //     await product.save();
  
  //     // Responder con el producto actualizado
  //     return res.json(product);
  //   } catch (error) {
  //     // Manejar cualquier error y responder con un mensaje de error 500
  //     console.error('Error updating product quantity:', error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // }

  if (method === 'PATCH') {
    const { id, cantidad } = req.body;
  
    try {
      // Actualizar la cantidad del producto en la base de datos
      const result = await Product.updateOne({ _id: id }, { cantidad: cantidad });
  
      if (result.nModified === 0) {
        // Si no se encontró el producto para actualizar, responder con un error 404
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Responder con un mensaje de éxito
      return res.json({ success: true });
    } catch (error) {
      // Manejar cualquier error y responder con un mensaje de error 500
      console.error('Error updating product quantity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true)
    }
  }
}