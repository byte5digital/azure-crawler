import * as express from "express"

export const app = express()

const whois = require("whois")
const domainPing = require("domain-ping")

app.get("/", async (req, res) => {
	res.statusCode = 404
	res.send()
})

app.get("/:domain", async (req, res) => {
	console.log("new Request")
	res.statusCode = 200
	domainPing(req.params.domain).then(async (data) => {
	  console.log(data)

		res.statusCode = 200
		res.json({
			ip: data.ip,
			isAzure: false
		})

		await whois.lookup(data.ip, (errW, dataW) => {
			  console.log(errW)
			  console.log(dataW)
			res.statusCode = 200
			res.json({
				ip: data.ip,
				isAzure: dataW.includes("msndcc@microsoft.com")
			})
		})
		
	})
		.catch((error)=>{
			console.log(error)
			res.statusCode = 500
			res.send()
		})


})

const PORT = 3001
app.listen(PORT, () => {
})
