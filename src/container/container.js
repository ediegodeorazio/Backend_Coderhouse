const fs = require('fs')

class Contenedor {
    constructor(filename) {
        this.filename = filename
    }

    //Save(Object)
    async save(object) {
        try {
            //Generate file
            if (fs.existsSync(this.filename)) {
                let info = await fs.promises.readFile(this.filename, 'utf8')
                let result = JSON.parse(info)

                //If there are one product
                if (result.length > 0) {
                    let lastId = result.length + 1
                    let newProduct = {
                        id: lastId,
                        ...object
                    }
                    result.push(newProduct)
                    await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                    return lastId
                } else { //if array empty
                    let newProduct = {
                        id: 1,
                        ...object
                    }
                    result.push(newProduct)
                    await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                    return 1
                }
            } else {
                //If filename doesn't exist, add product with id = 1
                let newProduct = {
                    id: 1,
                    ...object
                }
                await fs.promises.writeFile(this.filename, JSON.stringify([newProduct], null, 2))
                return 1
            }
        } catch (error) {
            console.log(error)
        }
    }

    //getById(Number)
    async getById(id) {
        id = Number(id)
        try {
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)

            return result.find(product => product.id === id)
        } catch (error) {
            return null
        }
    }

    //getAll()
    async getAll() {
        try {
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    //deleteById(number)
    async deleteById(id) {
        try {
            id = Number(id)
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)

            const objectToDelete = result.find(product => product.id === id)

            if (objectToDelete) {
                const index = result.indexOf(objectToDelete)
                result.splice(index, 1)
                await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                return true
            } else {
                console.log(`Id ${id} doesn't exists`)
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    //deleteAll()
    async deleteAll() {
        await fs.promises.writeFile(this.filename, JSON.stringify([]))
    }

    //updateById()
    async updateById(id, newObject) {
        try {
            id = Number(id)
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)

            const objectToUpdate = result.find(product => product.id === id)
            if (objectToUpdate) {
                const index = result.indexOf(objectToUpdate)

                const objectKeys = Object.keys(newObject)

                objectKeys.forEach(key => {
                    result[index][key] = newObject[key]
                })

                await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                return true
            } else {
                console.log(`Id ${id} doesn't exists`)
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }

    /* Cart */
    async addToCartById(id, newObject) {
        try {
            id = Number(id)
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)

            const objectToAdd = result.find(product => product.id === id)
            if(objectToAdd) {
                const index = result.indexOf(objectToAdd)
                const getValue = result[index]
                const getProducts = getValue['products']
                getProducts.push(newObject.products)

                await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                return true
            } else {
                console.log(`Id ${id} doesn't exists or content is wrong`)
                return false
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async removeFromCartById(id, idObjToRemove, objKey) {
        try {
            id = Number(id)
            let info = await fs.promises.readFile(this.filename, 'utf8')
            let result = JSON.parse(info)

            const objectToUpdate = result.find(product => product.id === id)
            if(objectToUpdate) {
                const index = result.indexOf(objectToUpdate)

                const getValue = result[index][objKey]
                let indexToRemove = -1
                getValue.forEach((element, indexN) => {
                    if(element.id == idObjToRemove) {
                        indexToRemove = indexN
                    }
                })

                const newArray = [...getValue]

                if(indexToRemove > -1) {
                    newArray.splice(indexToRemove, 1)
                }

                result[index][objKey] = newArray
                await fs.promises.writeFile(this.filename, JSON.stringify(result, null, 2))
                return true
            } else {
                console.log(`Id ${id} doesn't exists`)
                return false
            }
        } 
        catch (error) {
            console.log(error)
        }
    }
}

module.exports = Contenedor