import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner: "",
    title: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: "",
    quantity: "",
    image: "",
    category: "Conference",
  });
  
  const [loading, setLoading] = useState(false);

  const categories = [
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
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/upload/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setFormData((prev) => ({ ...prev, image: response.data.data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/createEvent`,
        formData,
        { withCredentials: true }
      );
      alert("Event created successfully!");
      navigate("/events"); // Redirect to events page
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Appbar/>
      <div className="flex flex-col gap-4 mt-5">
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
            <input
              type="text"
              name="organizedBy"
              placeholder="Organized By"
              value={formData.organizedBy}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="ticketPrice"
              placeholder="Ticket Price"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Availability *Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex items-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
              {loading && <div className="ml-2">Please wait...</div>}
            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Uploaded"
                className="w-full h-32 object-cover mt-2 rounded"
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
