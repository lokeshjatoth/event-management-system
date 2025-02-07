/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Link } from "react-router-dom";

const EventCard = ({ 
    title, 
    description, 
    image, 
    id, 
    likes, 
    participants, 
    category, 
    date, 
    time,
    location,
    organizedBy,
    userHasLiked,
    userHasParticipated,
    ticketPrice 
}) => {
    return (
        <div>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
                <Link to={`/event/${id}`}>
                    <img className="rounded-t-lg w-full h-45 object-cover" src={image} alt="thumbnail" />
                </Link>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <Link to={`/event/${id}`}>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-90">{title.slice(0, 15)+"..."}</h5>
                        </Link>
                        <span className="bg-green-100 text-green-800 text-lg font-semibold px-2.5 py-0.5 rounded-sm">
                            ₹{ticketPrice}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">{category}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {location}
                        </span>
                    </div>
                    <p className="mb-3 font-normal text-gray-700">{description.slice(0, 50)+"..."}</p>

                    {/* Likes & Participants with real-time updates */}
                    <div className="flex justify-between text-gray-600 text-sm mb-3">
                        <span className="flex items-center">
                            <span className="mr-1">👍</span>
                            <span className="transition-all duration-300">
                                {likes} {likes === 1 ? 'Like' : 'Likes'}
                            </span>
                        </span>
                        <span className="flex items-center">
                            <span className="mr-1">🎟</span>
                            <span className="transition-all duration-300">
                                {participants} {participants === 1 ? 'Participant' : 'Participants'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <Link 
                            to={`/event/${id}`} 
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            View Details
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                        <div className="flex justify-between mt-3">
                            <p className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                            <p className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {time}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
