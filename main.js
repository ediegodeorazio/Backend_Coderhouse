//Express
const express = require("express");
const app = express();

//Socket / Http
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app)
const io = new Server(server)

//SQL
const options = require('./connections/options.js');
const knex = require('knex');
const connectionMySql = knex(options.mysql);
const connectionSqlite3 = knex(options.sqlite3)

//Container
const Contenedor = require("./contenedor")
const newProduct = new Contenedor(options.mysql, 'productos');
const newChat = new Contenedor(options.sqlite3, 'mensajes');

//Parse JSON / public
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

//Handlebars
const handlebars = require('express-handlebars')

//Set app
app.set("views", "./views") //Especifica el directorio de vistas
app.set("view engine", "hbs") //Registra el motor de plantillas

//Configuracion handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/partials",
    })
)

//Io Connection
io.on("connection", async (socket) => {
    console.log("Usuario Conectado")

    //Crear la tabla
    try {
        //Productos
        const exists = await connectionMySql.schema.hasTable('productos')

        if (exists) {
            await connectionMySql.schema.dropTable('productos')
        }

        await connectionMySql.schema.createTable('productos', (table) => {
            table.increments('id').primary
            table.string('title', 25).notNullable()
            table.float('price')
            table.string('thumbnail', 100)
        })

        const products = await newProduct.getAll()
        socket.emit("list-products", products)

        socket.on("productAdded", async (data) => {
            await newProduct.save(data);

            const products = await newProduct.getAll()
            io.sockets.emit("list-products-update", products)
        })

// Mensajes
        const existsMsg = await connectionSqlite3.schema.hasTable('mensajes')

        if (existsMsg) {
            await connectionSqlite3.schema.dropTable('mensajes')
        }

        await connectionSqlite3.schema.createTable('mensajes', (table) => {
            table.increments('id').primary
            table.string('email', 40).notNullable()
            table.string('message', 100).notNullable()
            table.string('date', 100).notNullable()
        })

        const msgs = await newChat.getAll();
        socket.emit("send-message", msgs)

        socket.on("newMessage", async (data) => {
            await newChat.save(data)

            const msg = await newChat.getAll();
            io.sockets.emit("send-message-update", msg)
        })

        socket.on("disconnect", () => {
            console.log("Usuario desconectado")
        })

    } catch (error) {
        console.log(error)
    }
})

//Endpoints************
//GetList
app.get("/productos", async (req, res) => {
    const products = await newProduct.getAll();
    res.render("listProducts", { products });
});

//AddProduct (form)
app.get("/", (req, res) => {
    res.render("form", {});
});

//AddProduct fn
app.post("/productos", async (req, res) => {
    const dataBody = req.body;
    await newProduct.save(dataBody);
    res.redirect("/");
});

//Server on
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

server.on("error", (err) => console.log(err))
