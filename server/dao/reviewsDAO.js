import mongodb from "mongodb";
import { ObjectId } from "mongodb";

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            if (!conn) {
                throw new Error("Database connection is undefined!");
            }
            const db = conn.db(process.env.RESTREVIEWS_NS);
            if (!db) {
                throw new Error(`Database ${process.env.RESTREVIEWS_NS} not found!`);
            }
    
            reviews = db.collection("reviews");
            if (!reviews) {
                throw new Error("Collection 'reviews' not found!");
            }
        } catch (error) {
            console.error(`Unable to establish collection handle in ReviewsDAO: ${error}`);
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {name: user.name,
                user_id: user._id,
                date: date,
                text: review,  
                restaurant_Id: new ObjectId(restaurantId),
            }

            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${error}`);
            return {error: error};
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId)},
                { $set: {text: text, date: date }}
            )

            return updateResponse
        } catch (error) {
            console.error(`Unable to update review: ${error}`)
            return {error: error}
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                user_id: userId,
            });

            return deleteResponse;
        } catch (error) {
            console.error(`unable to delete review ${error}`);
            return {error: error};
        }
    }
}