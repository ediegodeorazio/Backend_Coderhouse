const config = require("../../config/config")
const contenedor = require("../../container/mongodb")

const productos = new contenedor("products", {
    title: {type: String, require: true, max: 100},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true, max: 100}
})

const crud = async () => {
    await config.initMongoDB()
    await productos.save({title: "DBZ: Tenkaichi 3", price: 565, thumbnail: "https://i.ibb.co/8NyJF70/dbz.jpg"})
    //await productos.getAll()
    //await productos.getById("639787392d55a93df2e44996")
    //await productos.deleteAll()
    //await productos.deleteById("63979d03f3b9d132c39460c5")
}

crud()