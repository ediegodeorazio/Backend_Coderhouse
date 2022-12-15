const fs = require('fs');

class Carrito {
    constructor(filename){
        this.filename = filename
        this.id = 1
    }

    async save(){
        try{
            if(!fs.existsSync(this.filename)) {
                await fs.promises.writeFile(this.filename, JSON.stringify([
                    {
                        id: this.id,
                        timestamp: Date.now(),
                        productos: []
                    }
                ]));
                return { msj: `Cart was successfully created with ID ${this.id}`}
            }else{
                const filename = await fs.promises.readFile(this.filename, 'utf-8')
                const json = JSON.parse(filename);
                if(json.length > 0){
                    json.push(
                        {
                            id: json.length + 1,
                            timestamp: Date.now(),
                            productos: []
                        }
                    )
                    await fs.promises.writeFile(this.filename, JSON.stringify(json))
                    return { msj: `Cart was successfully created with ID ${json.length}`}
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }

    async deleteById(id){
        try {
            const filename = await fs.promises.readFile(this.filename, 'utf-8')
            const json = JSON.parse(filename);
            if (json.length > 0) {
                const index = json.findIndex(obj => obj.id === id)
                if (index === -1) {
                    return {msj: `Cart with ID ${id} doesn't exist`}
                } else {
                    json.splice(index, 1)
                    await fs.promises.writeFile(this.filename, JSON.stringify(json))
                    return {msj: `Cart with ID ${id} was deleted`}
                }
            }
        }catch(error){
            console.log(error)
        } 
    } 

    async getById(id){
        try {
            const filename = await fs.promises.readFile(this.filename, 'utf-8')
            const json = JSON.parse(filename);
            if (json.length > 0) {
                const obj = json.find(obj => obj.id === id)
                if (obj){
                    return obj.productos
                }else{
                    return {error: "Cart doesn't exist"}
                } 
            }
        } catch (error) {
            console.log(error)
        }
    }

    async saveProduct(id, product){
        try {
            const filename = await fs.promises.readFile(this.filename, 'utf-8')
            const json = JSON.parse(filename);
            if (json.length > 0) {
                const obj = json.find(obj => obj.id === id)
                if (obj){
                    obj.productos.push(product)
                    await fs.promises.writeFile(this.filename, JSON.stringify(json))
                    return obj.productos
                }else{
                    return {error: "Cart doesn't exist"}
                } 
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(id, idProduct){
        try {   
            const filename = await fs.promises.readFile(this.filename, 'utf-8')
            const json = JSON.parse(filename);
            if (json.length > 0) {
                const carrito = json.find(obj => obj.id === id)
                if (carrito){
                    const index = carrito.productos.findIndex(producto => producto.id === idProduct)
                    if (index === -1) {
                        return {msj: `Product with ID ${idProduct} doesn't exist`}
                    } else {
                        carrito.productos.splice(index, 1)
                        await fs.promises.writeFile(this.filename, JSON.stringify(json))
                        return {msj: `Product with ID ${idProduct} was deleted`}
                    }
                }else{
                    return {error: `Cart with ID ${id} doesn't exist`}
                } 
            }
        } catch (error) {
            console.log(error)
        }
    }
} 

module.exports = Carrito