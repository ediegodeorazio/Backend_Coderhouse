const Contenedor = require('../../container/carrito')

class Carrito extends Contenedor{
    constructor(){
        super('src/db/cart.json')
    }
}

module.exports = Carrito