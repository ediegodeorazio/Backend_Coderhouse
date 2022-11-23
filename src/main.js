//Express
const express = require('express')
const app = express()

//JSON
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Container
const Contenedor = require("./container/container")
const newProduct = new Contenedor("./src/db/products.json", ["timestamp", "title", "price", "description", "code", "image", "stock"])
const newCart = new Contenedor("./src/db/cart.json", ["timestamp", "products"])

//Import routes
const routeProducts = express.Router()
const routeCart = express.Router()

//Implement route
app.use('/api/productos', routeProducts)
app.use('/api/carrito', routeCart)

//.ENV
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 8080


/* Auth Middleware */
const middlewareAuth = app.use((req, res, next) => {
    req.header('authorization') == process.env.TOKEN 
        ? next()
        : res.status(401).json({"error": "unauthorized route"})
})

/* ################## ENDPOINTS ################## */
// PRODUCTS >>>>>>
//getAll > api/productos
routeProducts.get('/', async (req, res) => {
    const products = await newProduct.getAll()
    res.status(200).json(products)
})

//getById > api/productos/:id
routeProducts.get('/:id', async (req, res) => {
    const getId = req.params.id
    const product = await newProduct.getById(getId)
    product
        ? res.status(200).json(product)
        : res.status(400).json({"Error": "Product/s doesn't exist"})
})

//post (save) > api/productos
routeProducts.post('/', middlewareAuth, async (req, res, next) => {
    const getBody = req.body
    getBody.timestamp = Date.now()
    const newProductId = await newProduct.save(getBody)
    
    newProductId
        ? res.status(200).json({"Success" : "Product successfully added with ID: " + newProductId})
        : res.status(400).json({"Error": "Please verify the body content"})
})

//Put > api/productos/:id
routeProducts.put('/:id', middlewareAuth, async (req, res, save) => {
    const getId = req.params.id
    const getBody = req.body
    const wasUpdated = await newProduct.updateById(getId, getBody)
    
    wasUpdated
        ? res.status(200).json({"Success" : "Product updated successfully"})
        : res.status(404).json({"Error": "Product/s doesn't exist"})
})

//Delete > /api/productos/:id
routeProducts.delete('/:id', middlewareAuth, async (req, res, next) => {
    const getId = req.params.id
    const wasDeleted = await newProduct.deleteById(getId)
    
    wasDeleted 
        ? res.status(200).json({"Success": "Product successfully removed"})
        : res.status(404).json({"Error": "Product/s doesn't exist"})
})  

// CART >>>>>>
//post (carrito) > /api/carrito
routeCart.post('/', async(req, res) => {
    const getBody = req.body
    
    getBody.timestamp = Date.now()
    getBody.products = []
    const newCartId = await newCart.save(getBody)
    
    newCartId
        ? res.status(200).json({"Success" : "Product added to cart with ID: " + newCartId})
        : res.status(400).json({"Error": "Please verify the body content"})
})

// POST /api/carrito/:id/productos
routeCart.post('/:id/productos', async(req,res) => {
    const { id } = req.params
    const { body } = req
    
    const product = await newProduct.getById(body['id'])
    
    if (product) {
        const cartExist = await newCart.addToCartById(id, {"products": product})
        cartExist
            ? res.status(200).json({"Success" : "Product was successfully added to cart"})
            : res.status(404).json({"Error": "Please verify the body content"})
    } else {
        res.status(404).json({"Error": "Please verify the body content or ID"})
    }
})

//delete (carrito) > /api/carrito/id
routeCart.delete('/:id', async (req, res) => {
    const getId = req.params.id
    const wasDeleted = await newCart.deleteById(getId);
    
    wasDeleted 
        ? res.status(200).json({"Success": "Cart was successfully removed."})
        : res.status(404).json({"Error": "Cart doesn't exist"})
})

//getCartProductsById /api/carrito/:id/productos
routeCart.get('/:id/productos', async(req, res) => {
    const getId = req.params.id
    const cart = await newCart.getById(getId)
    
    cart
        ? res.status(200).json(cart.products)
        : res.status(404).json({"Error": "Cart doesn't exists"})
})

//delete /api/carrito/:id/productos/:idProd
routeCart.delete('/:id/productos/:idProd', async(req, res) => {
    const {id, idProd } = req.params
    const productExists = await newProduct.getById(idProd)
    if (productExists) {
        const cartExists = await newCart.removeFromCartById(id, idProd, 'products')
        cartExists
            ? res.status(200).json({"Success" : "Product was successfully removed from cart."})
            : res.status(404).json({"Error": "Cart doesn't exists"})
    } else {
        res.status(404).json({"Error": "Product doesn't exists"})
    }
})

//Server
const server = app.listen(PORT, () => {
    console.log(`Server listening: https://localhost:${server.address().port}`)
})

server.on('error', error => console.log(`Error: ${error}`))