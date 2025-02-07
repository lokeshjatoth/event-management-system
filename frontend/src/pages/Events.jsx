import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import axios from "axios";
import EventCard from "../components/EventCard";
import Appbar from "../components/Appbar";
import { useSocket } from "../hooks/useSocket";

const eventCategories = [
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const socket = useSocket();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (filters.categories.length > 0) {
          queryParams.append("category", filters.categories.join(","));
        }
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        if (filters.startTime) queryParams.append("startTime", filters.startTime);
        if (filters.endTime) queryParams.append("endTime", filters.endTime);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/all?${queryParams.toString()}`,
          { withCredentials: true }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for likes update
    socket.on('eventLiked', (data) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === data.eventId 
            ? { 
                ...event, 
                likes: data.likes,
                userHasLiked: data.userId === event.currentUserId ? !event.userHasLiked : event.userHasLiked
              }
            : event
        )
      );
    });

    // Listen for participants update
    socket.on('eventParticipated', (data) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === data.eventId 
            ? { 
                ...event, 
                participantCount: data.participantCount,
                userHasParticipated: data.userId === event.currentUserId ? !event.userHasParticipated : event.userHasParticipated
              }
            : event
        )
      );
    });

    return () => {
      socket.off('eventLiked');
      socket.off('eventParticipated');
    };
  }, [socket]);

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category) // Remove if already selected
        : [...prev.categories, category], // Add if not selected
    }));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Appbar />
      <HeroSection />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Events</h1>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {/* Category Filter (Checkboxes) */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {eventCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label htmlFor="minPrice" className="font-semibold">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="maxPrice" className="font-semibold">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="font-semibold">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="endDate" className="font-semibold">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label htmlFor="startTime" className="font-semibold">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="endTime" className="font-semibold">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Events Listing */}
        {loading ? (
          <p className="text-center text-lg">Loading events...</p>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                description={event.description}
                image={event.image}
                likes={event.likes}
                participants={event.participants.length}
                category={event.category}
                date={event.eventDate}
                time={event.eventTime}
                location={event.location}
                organizedBy={event.organizedBy}
                userHasLiked={event.userHasLiked}
                userHasParticipated={event.userHasParticipated}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
