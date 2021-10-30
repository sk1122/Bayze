import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import * as dotenv from "dotenv"
import http from "http"

import { connection } from "./connection"
import {Connection, getConnection} from "typeorm";
import { adoneRouter } from "./adone/router"
import { authRouter } from "./authentication/router"
import { organizationRouter } from "./organization/router"

dotenv.config()

if(!process.env.PORT) {
	process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)
const app = express()
const server = http.createServer(app)

app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
        allowedHeaders: ['Content-Type'],
        origin: ['http://localhost:3000']
	})
)
app.use(express.json())

// Close Database Connection after every request
app.use(async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
		if(res.statusCode >= 400 && res.statusCode <= 599) console.log(new Date() + " " + req.baseUrl + " \x1b[31m" + `${res.statusCode} \x1b[37m`)
		else console.log(new Date() + " " + req.baseUrl + " \x1b[32m" + `${res.statusCode} \x1b[37m`)
	});
    next();
});

app.use("/api/accounts/", authRouter)
connection.then(() => {
	app.use("/api/", adoneRouter)
	app.use("/api/organization/", organizationRouter)
})

server.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`)
})