import app from "./server.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();  // Load environment variables

const port = process.env.PORT || 8000;
const mongoUri = process.env.RESTREVIEWS_DB_URI;

if (!mongoUri) {
    console.error("❌ MongoDB connection string is missing. Check your .env file.");
    process.exit(1);
}

async function startServer() {
    try {
        const client = new MongoClient(mongoUri, {
            maxPoolSize: 50,   
            wtimeoutMS: 2500,  
        });

        await client.connect();

        await RestaurantsDAO.injectDB(client);

        await ReviewsDAO.injectDB(client);

        console.log("✅ Connected to MongoDB");
 
        // Start Express server
        app.listen(port, () => {
            console.log(`🚀 Server listening on port ${port}`);
        });

    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

// Call the function to start the server
startServer();
