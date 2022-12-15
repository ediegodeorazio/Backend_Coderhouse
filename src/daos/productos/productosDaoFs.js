const Contenedor = require('../../container/container')

class Productos extends Contenedor{
    constructor(){
        super('src/db/products.json')
    }
}

module.exports = Productos