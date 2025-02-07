import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizedBy: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    location: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    count: { type: Number, default: 0 }, 
    income: { type: Number, default: 0 },
    ticketPrice: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, 
    image: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    bookingCount: { type: Number, default: 0 },
    category: {
      type: String,
      enum: [
        "Conference",
        "Workshop",
        "Seminar",
        "Webinar",
        "Meetup",
        "Concert",
        "Festival",
        "Networking",
        "Trade Show",
        "Sports",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
