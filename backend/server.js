const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

//kết nối với MongoDB 
connectDB();

app.get("/",(req, res) => {
    res.send("XIN CHAO Api Lunabakery!");
});

//API Routes
app.use("/api/users", userRoute);


app.listen(PORT, () => {
    console.log(`Server chay tren http://localhost:${PORT}`);
});