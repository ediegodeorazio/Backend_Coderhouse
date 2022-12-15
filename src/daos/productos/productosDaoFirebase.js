const config = require("../../config/config")
const contenedor = require("../../container/firebase")

const productos = new contenedor("products")

const crud = async () => {
    await config.initFirebase()
    await productos.save({title: "DBZ: Tenkaichi 3", price: 565, thumbnail: "https://i.ibb.co/8NyJF70/dbz.jpg"})
    await productos.getAll()
    await productos.getById("qA1wrmaL9rcUY4yHIEZH")
    await productos.deleteById("qA1wrmaL9rcUY4yHIEZH")
    await productos.deleteAll()
}

crud()