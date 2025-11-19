import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";

connectDB();


const PORT = config.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Music Server is running on port ${PORT}`);
})