import Event from "../models/Event.js";
import User from "../models/User.js";
import { deleteImage } from "../utils/cloudinary.js"; 

export const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        eventData.owner = req.user.id;

        const newEvent = new Event(eventData);
        await newEvent.save();

        await User.findByIdAndUpdate(req.user.id, {
            $push: { events: newEvent._id }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to save the event to MongoDB" });
    }
};


export const getAllEvents = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, startDate, endDate, startTime, endTime } = req.query;

        let filter = {};

        // Handle multiple category filtering
        if (category) {
            const categoriesArray = Array.isArray(category) ? category : category.split(",");
            filter.category = { $in: categoriesArray };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.ticketPrice = {};
            if (minPrice) filter.ticketPrice.$gte = Number(minPrice);
            if (maxPrice) filter.ticketPrice.$lte = Number(maxPrice);
        }

        // Filter by date range
        if (startDate || endDate) {
            filter.eventDate = {};
            if (startDate) filter.eventDate.$gte = new Date(startDate);
            if (endDate) filter.eventDate.$lte = new Date(endDate);
        }

        // Filter by time range
        if (startTime || endTime) {
            filter.eventTime = {};
            if (startTime) filter.eventTime.$gte = startTime;
            if (endTime) filter.eventTime.$lte = endTime;
        }

        const events = await Event.find(
            filter,
            "title description image likes participants category ticketPrice eventDate eventTime location organizedBy"
        );
        console.log(events);

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 

        const event = await Event.findById(id)
            .populate("owner", "name email")
            .select("title description image likes participants category ticketPrice eventDate eventTime owner likedBy location organizedBy");
            
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const userHasLiked = event.likedBy.includes(userId);
        const userHasParticipated = event.participants.includes(userId);

        // Convert to a plain object and add computed fields
        const eventData = {
            ...event.toObject(),
            participantCount: event.participants.length,
            userHasLiked,
            userHasParticipated
        };

        // Remove sensitive data
        delete eventData.likedBy;
        delete eventData.__v;

        res.status(200).json(eventData);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ error: "Failed to fetch event from MongoDB" });
    }
};




export const likeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    if (!eventId|| !userId) return res.status(400).json({ error: "Missing eventId or userId" });
    
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });



    

    if (event.likedBy.includes(userId)) {
      event.likes -= 1;
      event.likedBy = event.likedBy.filter(id => !id.equals(userId)); 
    } else {
      event.likes += 1;
      event.likedBy.push(userId); 
    }

    console.log("User ID:", userId);
    await event.save();
    console.log("Event ID:", eventId);

    req.io.to(eventId).emit("likeUpdate", { eventId, likesCount: event.likes });

    return res.json({ success: true, likesCount: event.likes });
  } catch (error) {
    console.error("Error in likeEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  
  
  
  


export const participateEvent = async (req, res) => {
    try {
        
        const { eventId } = req.params;
        const userId = req.user.id;
        if (!eventId || !userId) return res.status(400).json({ error: "Missing eventId or userId" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.participants.some(id => id.equals(userId))) {
            event.participants = event.participants.filter(id => !id.equals(userId));
        } else {
            event.participants.push(userId);
        }

        await event.save();

        req.io.to(eventId).emit("participantUpdate", {
            eventId,
            participantCount: event.participants.length,
        });

        return res.json({ success: true, participantCount: event.participants.length });
    } catch (error) {
        console.error("Error in participateEvent:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (!event.owner.equals(userId)) {
            return res.status(403).json({ error: "Unauthorized to delete this event" });
        }

        // Extract image ID from URL and delete it from Cloudinary
        if (event.image) {
            const imageId = event.image.split("/").pop().split(".")[0]; // Extract ID before extension
            await deleteImage(imageId);
        }

        // Remove event reference from owner's user profile
        await User.findByIdAndUpdate(userId, { $pull: { events: id } });

        // Remove event from database
        await Event.findByIdAndDelete(id);

        return res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};