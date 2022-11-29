//Express
import express from "express"
const app = express()

//Socket / Http
import { Server } from "socket.io"
import http from "http"
const server = http.createServer(app)
const io = new Server(server)

//SQL
import { options } from "./connections/options.js"
import knex from "knex"
const connectionMySql = knex(options.mysql)
const connectionSqlite3 = knex(options.sqlite3)

//Container
import { Contenedor } from "./Contenedor.js"
const newProduct = new Contenedor(connectionMySql, 'productos')
const newChat = new Contenedor(connectionSqlite3, 'mensajes')

//Parse JSON / public
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

//Handlebars
import handlebars from "express-handlebars"

//Set app
app.set("views", "./views") //Especifica el directorio de vistas
app.set("view engine", "hbs") //Registra el motor de plantillas

//Configuracion handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "./views",
        partialsDir: "./views/partials",
    })
)

//MySql + Sqlite3
import { mysqlFunc, sqlite3Func } from "./connections/connections.js"
//Crear tabla productos
mysqlFunc()

//Crear tabla mensajes
sqlite3Func()

//Io Connection
io.on("connection", async (socket) => {
    console.log("Usuario Conectado")

    try {

        //Productos
        const products = await newProduct.getAll()
        socket.emit("list-products", products)

        socket.on("productAdded", async (data) => {
            await newProduct.save(data);

            const products = await newProduct.getAll()
            io.sockets.emit("list-products-update", products)
        })

        //Mensajes
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
