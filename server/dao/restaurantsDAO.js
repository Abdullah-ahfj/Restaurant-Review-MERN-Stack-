import mongodb from "mongodb";
import { ObjectId } from "mongodb";


let restaurants;

export default class RestaurantsDAO {
    static async injectDB(conn){
        if (restaurants){
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (error) {
            console.error(`Unable to stablish a collection handle in restaurantsDAO: ${error}`)
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage=20,

    } = {}){

        let query;
        if (filters) {
            if ("name" in filters) {
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let curser;

        try {
            curser = await restaurants
                .find(query)
        } catch (error) {
            console.error(`Unable to issue find command, ${error}`)
            return {restaurantsList: [], totalNumRestaurants: 0 }
        }

        const displayCurser = curser.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCurser.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return {restaurantsList, totalNumRestaurants}
        } catch (error) {
            console.error("Unable to convert cuser to array or problem counting documents, "+error);

            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
    
    static async getRestaurantByID(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error("Invalid ObjectId format.");
            }
    
            console.log(`Fetching restaurant with ID: ${id}`);
    
            const pipeline = [
                {
                    $match: { _id: new ObjectId(id) },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$restaurant_Id", "$$id"] },
                                },
                            },
                            {
                                $sort: { date: -1 },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
                {
                    $limit: 1, // Prevent unnecessary processing
                },
            ];
    
            const result = await restaurants.aggregate(pipeline).next();
    
            if (!result) {
                return { error: "Restaurant not found" };
            }
    
            return result;
        } catch (error) {
            console.error(`Something went wrong in getRestaurantByID: ${error.message}`);
            return { error: error.message };
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines;
        } catch (error) {
            console.error(`Unable to get cuisines, ${error}`);
            return cuisines                
        }
    }
}