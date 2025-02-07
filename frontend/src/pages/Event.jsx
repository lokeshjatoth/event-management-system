// frontend/src/pages/EventPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Appbar from "../components/Appbar";
import { useSocket } from "../hooks/useSocket";

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/get/${id}`,
          { withCredentials: true }
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!socket || !event) return;

    // Join event room
    socket.emit('joinEventRoom', id);

    // Listen for likes update
    socket.on('eventLiked', (data) => {
      if (data.eventId === id) {
        setEvent(prev => ({
          ...prev,
          likes: data.likes,
          userHasLiked: data.userId === event.currentUserId ? !prev.userHasLiked : prev.userHasLiked
        }));
      }
    });

    // Listen for participants update
    socket.on('eventParticipated', (data) => {
      if (data.eventId === id) {
        setEvent(prev => ({
          ...prev,
          participantCount: data.participantCount,
          userHasParticipated: data.userId === event.currentUserId ? !prev.userHasParticipated : prev.userHasParticipated
        }));
      }
    });

    return () => {
      socket.emit('leaveEventRoom', id);
      socket.off('eventLiked');
      socket.off('eventParticipated');
    };
  }, [socket, id, event]);

  const handleLike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/like/${id}`,
        {},
        { withCredentials: true }
      );
      // Optimistically update UI
      setEvent(prev => ({
        ...prev,
        likes: prev.userHasLiked ? prev.likes - 1 : prev.likes + 1,
        userHasLiked: !prev.userHasLiked
      }));
    } catch (error) {
      console.error("Error liking event:", error);
    }
  };

  const handleParticipate = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/participate/${id}`,
        {},
        { withCredentials: true }
      );
      // Optimistically update UI
      setEvent(prev => ({
        ...prev,
        participantCount: prev.userHasParticipated ? prev.participantCount - 1 : prev.participantCount + 1,
        userHasParticipated: !prev.userHasParticipated
      }));
    } catch (error) {
      console.error("Error participating in event:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-center text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div>
        <Appbar />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-center text-red-500">{error || "Event not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            className="w-full h-96 object-cover"
            src={event.image}
            alt={event.title}
          />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                {event.category}
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-6">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date and Time */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Date & Time</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.eventTime}</span>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Organized by: {event.organizedBy}</span>
                </div>
              </div>

              {/* Price and Category */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Category: {event.category}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Price: ₹{event.ticketPrice || 'Free'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Event Stats</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="text-xl mr-2">👥</span>
                  <span>{event.participantCount} {event.participantCount === 1 ? 'Participant' : 'Participants'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-xl mr-2">👍</span>
                  <span>{event.likes} {event.likes === 1 ? 'Like' : 'Likes'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                className={`flex-1 max-w-xs px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  event.userHasLiked
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={handleLike}
              >
                <span className="text-xl">👍</span>
                {event.userHasLiked ? 'Unlike Event' : 'Like Event'}
              </button>

              <button
                className={`flex-1 max-w-xs px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  event.userHasParticipated
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                onClick={handleParticipate}
              >
                <span className="text-xl">🎟️</span>
                {event.userHasParticipated ? 'Cancel Participation' : 'Participate Now'}
              </button>
            </div>

            {event.owner && (
              <div className="mt-8 pt-6 border-t">
                <h2 className="text-xl font-semibold mb-2">Event Organizer</h2>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-gray-900">{event.owner.name}</p>
                    <p className="text-gray-600 text-sm">{event.owner.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
