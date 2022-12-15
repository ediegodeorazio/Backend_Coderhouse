const config = require("../../config/config")
const contenedor = require("../../container/mongodb")

const carritos = new contenedor("carritos", {
    timestamp: {type: String, require: true, max: 100},
    productos: {type: Array, require: true}
})

const crud = async () => {
    await config.initMongoDB()
    /* await carritos.save({timestamp: 1670919375156,products: [{
        timestamp:1670919375156,
        title:"DBZ: Tenkaichi 3",
        description:"Description here",
        code:"DBZZ-3",
        image:"https://i.ibb.co/8NyJF70/dbz.jpg",
        price:565,
        stock:6
    }]}) */
    //await carritos.getAll()
    //await carritos.getById("63978a0b5f16cfcd9378ba7b")
    //await carritos.deleteAll()
    //await carritos.deleteById("63978a0b5f16cfcd9378ba7b")
}

crud()