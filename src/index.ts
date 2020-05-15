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
  console.log("new Request")

  nslookup(req.params.domain).end(async (err, data) => {
    console.log(data[0])
    if (data && data.length > 0) {
      await whois.lookup(data[0], (errW, dataW) => {
        console.log(dataW)
        res.json({
          ip: data[0],
          isAzure: dataW.includes("msndcc@microsoft.com"),
        })
      })
      if (err) {
        res.statusCode = 500
        res.send()
      }
    }
    res.statusCode = 500
    res.send()
  })
})

const PORT = 3001
app.listen(PORT, () => {})
