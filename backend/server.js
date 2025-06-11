const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 9000;

app.get("/",(req, res) => {
    res.send("XIN CHAO Api Lunabakery!");
});

app.listen(PORT, () => {
    console.log(`Server chay tren http://localhost:${PORT}`);
});