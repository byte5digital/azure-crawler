import * as express from "express"
import { readSync } from "fs"

export const app = express()

const whois = require("whois")
const nslookup = require("nslookup")

app.get("/", async (req, res) => {
  res.statusCode = 404
  res.send()
})

app.get("/:domain", async (req, res) => {
  await nslookup(req.params.domain).end(async (err, data) => {
    if (data && data.length > 0) {
      console.log(data[0])
      await whois.lookup(data[0], async (errW, dataW) => {
        if (errW) {
          return res.status(404).send()
        }
        return res.json({
          ip: data[0],
          isAzure: dataW.includes("msndcc@microsoft.com"),
        })
      })
	} else {
		console.log('not found')
      return res.status(404).send()
    }
  })
})

const PORT = 3001
app.listen(PORT, () => {})
