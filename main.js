//Express
const express = require("express");
const app = express();

//Socket / Http
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app)
const io = new Server(server)

//Container
const Contenedor = require("./contenedor")
const newProduct = new Contenedor("products.json")
const newChat = new Contenedor("chat.json")

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

    const products = await newProduct.getAll();
    socket.emit("list-products", products)

    const msgs = await newChat.getAll();
    socket.emit("send-message", msgs)

    socket.on("newMessage", async (data) => {
        await newChat.save(data)

        const msg = await newChat.getAll();
        io.sockets.emit("send-message-update", msg)
    })

    socket.on("productAdded", async (data) => {
        await newProduct.save(data);

        const products = await newProduct.getAll()
        io.sockets.emit("list-products-update", products)
    })

    socket.on("disconnect", () => {
        console.log("Usuario desconectado")
    })
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
