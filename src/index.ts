import * as express from "express"
import { readSync } from "fs"
import { json } from "body-parser"

export const app = express()

const whois = require("whois-json")
const nslookup = require("nslookup")

app.get("/", async (req, res) => {
  res.statusCode = 404
  res.send()
})

app.get("/:domain", async (req, res) => {
  await nslookup(req.params.domain).end(async (err, data) => {
    if (data && data.length > 0) {
      console.log(data[0])
      let whoisResult = await whois(data[0])
      if (whoisResult) {
        return res.json({
          ip: data[0],
          isAzure: whoisResult.orgName
            ? whoisResult.orgName.includes("Microsoft")
            : "",
          registrar: whoisResult.orgName,
        })
      } else {
        console.log("not found")
        return res.status(404).send()
      }
    } else {
      console.log("not found")
      return res.status(404).send()
    }
  })
})

const PORT = 3001
app.listen(PORT, () => {})
