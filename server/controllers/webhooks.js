import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create Svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Get data and event type from request body
    const { data, type } = req.body;

    // Handle different Clerk events
    switch (type) {

      // User Created
      case "user.created": {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
          resume: "",
        };

        await User.create(userData);

        res.json({
          success: true,
          message: "User created successfully",
        });

        break;
      }

      // User Updated
      case "user.updated": {

        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);

        res.json({
          success: true,
          message: "User updated successfully",
        });

        break;
      }

      // User Deleted
      case "user.deleted": {

        await User.findByIdAndDelete(data.id);

        res.json({
          success: true,
          message: "User deleted successfully",
        });

        break;
      }

      default:
        res.json({
          success: true,
          message: "Webhook received",
        });
        break;
    }

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};