export class Contenedor {
    constructor(connection, table) {
        this.connection = connection;
        this.table = table
    }

    async save(object) {
        await this.connection(this.table).insert(object)
    }

    async getById(id) {
        return await this.connection(this.table).where('id', id)
    }

    async getAll() {
        return await this.connection(this.table)
    }

    async deleteById(id) {
        await this.connection(this.table).where('id', id).del()
        return id
    }

    async deleteAll() {
        await this.connection(this.table).del()
    }
}