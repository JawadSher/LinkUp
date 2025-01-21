import express from "express"

const app = express();

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/about", (req, res) => {
    res.send("about Page")
})

app.get("/contact", (req, res) => {
    res.send("contact Page")
})

app.get("/newpage", (req, res) => {
    res.send("newpage Page")
})

export {app};