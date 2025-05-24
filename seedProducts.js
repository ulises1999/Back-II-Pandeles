import mongoose from 'mongoose'; // Importa Mongoose
import "./src/helpers/setEnv.helper.js"
    import Product from "./src/dao/mongo/models/products.model.js"; // Ajusta la ruta a tu modelo de producto

    const productsToCreate = [
        {
            title: "Pan Integral de Campo",
            photo: "https://placehold.co/600x400/FF5733/FFFFFF?text=Pan+Integral",
            category: "panaderia",
            price: 3.50,
            stock: 50
        },
        {
            title: "Medialunas de Manteca (x6)",
            photo: "https://placehold.co/600x400/33FF57/FFFFFF?text=Medialunas",
            category: "pasteleria",
            price: 4.80,
            stock: 30
        },
        {
            title: "Tarta de Manzana Individual",
            photo: "https://placehold.co/600x400/5733FF/FFFFFF?text=Tarta+Manzana",
            category: "pasteleria",
            price: 6.20,
            stock: 15
        },
        {
            title: "Pan de Centeno con Semillas",
            photo: "https://placehold.co/600x400/33A0FF/FFFFFF?text=Pan+Centeno",
            category: "panaderia",
            price: 4.00,
            stock: 40
        },
        {
            title: "Facturas Variadas (x12)",
            photo: "https://placehold.co/600x400/FF33A0/FFFFFF?text=Facturas",
            category: "pasteleria",
            price: 8.00,
            stock: 20
        },
        {
            title: "Baguette Rústica",
            photo: "https://placehold.co/600x400/A0FF33/FFFFFF?text=Baguette",
            category: "panaderia",
            price: 2.50,
            stock: 60
        },
        {
            title: "Brownie de Chocolate",
            photo: "https://placehold.co/600x400/FFC133/FFFFFF?text=Brownie",
            category: "pasteleria",
            price: 3.00,
            stock: 25
        }
    ];

    async function seedProducts() {
        try {
            // Conectar a la base de datos
            await mongoose.connect(process.env.LINK_MONGO, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Conectado a MongoDB Atlas para sembrar productos.');

            // Opcional: Eliminar productos existentes antes de sembrar (para evitar duplicados en cada ejecución)
            // await Product.deleteMany({});
            // console.log('Productos existentes eliminados.');

            // Insertar los nuevos productos
            await Product.insertMany(productsToCreate);
            console.log(`${productsToCreate.length} productos creados con éxito.`);

        } catch (error) {
            console.error('Error al sembrar productos:', error);
        } finally {
            // Desconectar de la base de datos
            await mongoose.disconnect();
            console.log('Desconectado de MongoDB Atlas.');
        }
    }

    // Ejecutar el script de sembrado
    seedProducts();