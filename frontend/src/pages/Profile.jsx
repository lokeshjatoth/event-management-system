import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import Appbar from "../components/Appbar";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`, {
                    withCredentials: true, // Ensures cookies are sent
                });
                console.log("User Data:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const deleteHandler = async (eventId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/delete/${eventId}`, {
                withCredentials: true,
            });

            // Remove the deleted event from the user's events
            setUser((prevUser) => ({
                ...prevUser,
                events: prevUser.events.filter((event) => event._id !== eventId),
            }));

            console.log("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    if (loading) {
        return <p className="text-center text-lg">Loading user data...</p>;
    }

    if (!user) {
        return <p className="text-center text-lg text-red-500">Failed to load user data.</p>;
    }

    return (
        <div>
            <Appbar/>
            <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <h2 className="text-xl font-semibold mt-4 mb-2">My Events</h2>
                {loading ? (
                    <p className="text-center text-lg">Loading events...</p>
                ) : user.events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {user.events.map((event) => (
                            <div key={event._id}>
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
                                    ticketPrice={event.ticketPrice}
                                />
                                <div className="items-center justify-center flex mt-2">
                                    <button
                                        type="button"
                                        onClick={() => deleteHandler(event._id)}
                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No events found.</p>
                )}
            </div>
        </div>
        </div>
        
    );
};

export default Profile;
