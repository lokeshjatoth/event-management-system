import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Appbar from "../components/Appbar";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
    const [userInput, setUserInput] = useState({name: "", email: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setUserInput((c) => ({
            ...c, [e.target.name]: e.target.value
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
                userInput,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            
            // Update auth context with user data
            login(response.data);
            navigate("/events");
        } catch (error) {
            alert("Error while signing up");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Appbar/>
            <div className="h-screen flex items-center justify-center">
                <form className="relative space-y-3 rounded-md bg-white p-6 shadow-xl lg:p-10 border border-gray-100 m-10" onSubmit={submitHandler}>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-semibold lg:text-2xl">Sign Up</h1>
                        <p className="pb-4 text-gray-500">Create your Account</p>
                    </div>

                    <div className="">
                        <label className="" htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            id="name"
                            name="name"
                            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3 outline-none focus:ring"
                            required={true}
                            onChange={changeHandler}
                        />
                    </div>

                    <div className="">
                        <label className="" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            placeholder="Info@example.com"
                            id="email"
                            name="email"
                            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3 outline-none focus:ring"
                            required={true}
                            onChange={changeHandler}
                        />
                    </div>

                    <div>
                        <label className="" htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="******"
                            id="password"
                            name="password"
                            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3 outline-none focus:ring"
                            required={true}
                            onChange={changeHandler}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="mt-5 w-full rounded-md bg-blue-600 p-2 text-center font-semibold text-white outline-none focus:ring hover:cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader/> : "Sign Up"}
                        </button>
                    </div>
                    <div>
                        Already have an account? <Link to={"/login"} className="underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;