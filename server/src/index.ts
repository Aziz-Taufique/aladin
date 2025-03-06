import express from "express"

const app = express()
app.get("/", (req:any, res:any) => {
	res.send("hello")
})

app.get("/home", (req:any, res:any) => {
		res.send("hello form hooo")
})


app.listen(3000, () => {
	console.log(`Server is runnign...`)
})