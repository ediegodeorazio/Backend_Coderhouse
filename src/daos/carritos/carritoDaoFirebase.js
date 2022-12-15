const config = require("../../config/config")
const contenedor = require("../../container/firebase")

const carritos = new contenedor("carritos")

const crud = async () => {
    await config.initFirebase()
    await carritos.save({timestamp: 1670919375156,products: [{
        timestamp:1670919375156,
        title:"DBZ: Tenkaichi 3",
        description:"Description here",
        code:"DBZZ-3",
        image:"https://i.ibb.co/8NyJF70/dbz.jpg",
        price:565,
        stock:6
    }]})
    //await carritos.getAll()
    //await carritos.getById("BkbH848eWU3fMkG7w5Ax")
    //await carritos.deleteById("BkbH848eWU3fMkG7w5Ax")
    //await carritos.deleteAll()
}

crud()