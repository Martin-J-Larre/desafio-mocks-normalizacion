import express from "express";
const app = express();
import { router as productsRouter } from "./routers/productsApi.js";
import { router as chatRouter } from "./routers/chatApi.js";
import { getFakerProducts } from "./services/fakerProducts.js";

//-----------------Services

import { Container } from "./services/Container.js";
import { MessagesServices } from "./services/MessagesServices.js";
import { options as sqlite3Options } from "./db/options/sqlite3.js";
const sqliteServices = new Container(sqlite3Options, "products");
import { messagesCollection } from "./db/options/mongoDB.js";
const mongoServices = new MessagesServices(messagesCollection);

//-----------------Middlewares

app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//-----------------Routes

app.get("/", (req, res) => {
	res.render("./pages/index", {
		fakerProducts: [],
		products: [],
		messages: [],
	});
});

app.get("/api/faker/products", (req, res) => {
	res.json(getFakerProducts());
});
app.use("/api/products", productsRouter);
app.use("/api/chat", chatRouter);

//-----------------Server Listen

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Connected to URL:: http://localhost:${server.address().port}`);
});
server.on("error", (err) => console.log(`Error in server: ${err}`));

//-------------------Websockets

import { Server as IOServer } from "socket.io";
const io = new IOServer(server);

io.on("connection", async (socket) => {
	console.log("User connected...");

//Fetchs
//----------------fakerProducts
	const fakerProducts = getFakerProducts();

//----------------products
	const products = await sqliteServices.getElementsAll();

//----------------messages
	const messages = await mongoServices.getMessagesAll();

	socket.emit("loadFakerProducts", fakerProducts);
	socket.emit("loadProducts", products);
	socket.emit("loadMessages", messages);
});

export { io };