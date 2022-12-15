const admin = require("firebase-admin")

class Firebase{
    constructor(collection){
        this.collection = collection
    }

    async save(objeto){
        const db = admin.firestore()
        const query = db.collection(this.collection)
        await query.add(objeto)
    }

    async getById(id){
        const db = admin.firestore()
        const query = db.collection(this.collection)
        const doc = query.doc(id)
        const item = await doc.get()
        console.log(item.data())
    }

    async getAll(){
        const db = admin.firestore()
        const query = db.collection(this.collection)
        const allDocs = await query.get()
        allDocs.forEach(doc => {
            console.log(
                {
                    id: doc.id,
                    ...doc.data()
                }
            )
        })
    }

    async deleteById(id){
        const db = admin.firestore()
        const query = db.collection(this.collection)
        const doc = query.doc(id)
        const item = await doc.delete()
        console.log("File has been deleted")
    } 

    async deleteAll(){
        const db = admin.firestore()
        const query = db.collection(this.collection)
        const allDocs = await query.get()
        allDocs.forEach(doc => {
            this.deleteById(doc.id)
        })
    }

}

module.exports = Firebase