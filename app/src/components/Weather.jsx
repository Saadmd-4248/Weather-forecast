import React, { useEffect, useState } from "react";
import { Search } from 'lucide-react';

const Weather = () => {
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [searchCity, setSearchCity] = useState("");
    const [searchData, setSearchData] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB');
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const getWeatherIcon = (condition) => {
        const mapping = {
            "Clear": "sunny.png",
            "Clouds": "cloudy.png",
            "Haze": "cloudy.png",
            "Rain": "rainy.png",
            "Drizzle": "rainy.png",
            "Thunderstorm": "rainy.png",
            "Snow": "snow.png",
        };
        return mapping[condition] || "cloudy.png";
    };

    const fetchWeather = async (lat, lon) => {
        const apiKey = "ab0fb4404eb6223a129d05385bf1df80";
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        console.log("DEFAULT", data)
        setWeatherData(data);
        setLoading(false);
    };

    const fetchWeatherByCity = async () => {
        if (!searchCity) return;
        const apiKey = "ab0fb4404eb6223a129d05385bf1df80";
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (data.cod === "404") {
            alert("City not found. Please check the spelling and try again.");
            return;
        }
        setSearchCity("")
        console.log("BY CITY", data)

        setSearchData(data);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            (error) => {
                console.error("Location access denied.", error);
                setLoading(false);
            }
        );
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchWeatherByCity()
        }
    };

    return (
        <div className='h-screen flex relative justify-center items-center overflow-hidden'>
            <img src="src/components/assets/background.jpg" className='h-full w-screen object-cover' />


            <div className='bg-black/50 border border-white/40 rounded-2xl p-6 h-[82%] w-[75%] absolute flex items-center justify-center gap-5'>

                {/* Loading Screen */}
                <div className={`h-[100%] w-[60%] p-7 backdrop-blur-xl border flex flex-col items-center justify-center border-white/30 rounded-2xl ${loading ? '' : 'hidden'}`}>
                    <div className="w-[55%] mx-auto">
                        <img src="src/components/assets/output-onlinegiftools.gif" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1 className="font-poppins font-light text-white text-xl mt-5">Detecting your location</h1>
                        <p className="text-white font-thin text-xl mt-1">Just a moment...</p>
                    </div>
                </div>

                {/* Weather Info */}
                {!loading && weatherData && (
                    <div className='h-[100%] w-[60%] border backdrop-blur-xl p-7 border-white/30 rounded-2xl flex flex-col items-center justify-between bg-[linear-gradient(to_bottom,_rgba(233,208,34,0.1),_rgba(230,11,9,0.1))] '>
                        <div className=" flex flex-col items-center">
                            <div className="w-[60%]">
                                <img src={`src/components/assets/${getWeatherIcon(weatherData.weather[0].main)}`} className="w-full h-full object-cover" />
                            </div>

                            <div className="text-white text-center">
                                <h2 className="text-white text-3xl font-normal">{weatherData.weather[0].main}</h2>
                                <h2 className="text-white mb-4 text-2xl font-bold mt-1">{weatherData.name.toUpperCase()} ({weatherData.sys.country})</h2>
                            </div>
                            <div className="text-white font-poppins text-7xl font-bold">
                                {Math.round(weatherData.main.temp)}°
                            </div>
                        </div>

                        <div className="w-full flex justify-center gap-8">
                            <div className=" h-[90px] w-[40%] bg-white/10 backdrop-blur-sm rounded-xl flex flex-col items-center justify-between p-3">
                                <p className="text-white font-poppins text-xl font-extralight">Humidity</p>
                                <h1 className="font-poppins text-3xl font-semibold text-white">{weatherData.main.humidity}%</h1>
                            </div>
                            <div className=" h-[90px] w-[40%] bg-white/10 backdrop-blur-sm  rounded-xl flex flex-col items-center justify-between p-3">
                                <p className="text-white font-poppins text-xl font-extralight">Wind</p>
                                <h1 className="font-poppins text-3xl  font-semibold text-white">{Math.round(weatherData.wind.speed * 3.6)}Km/h</h1>
                            </div>
                            <div className=" h-[90px] w-[40%] bg-white/10 backdrop-blur-sm  rounded-xl flex flex-col items-center justify-between p-3">
                                <p className="text-white font-poppins text-xl font-extralight">Feels Like</p>
                                <h1 className="font-poppins text-3xl  font-semibold text-white">{Math.round(weatherData.wind.speed * 3.6)}Km/h</h1>
                            </div>

                        </div>


                    </div>
                )}

                {/* Search City */}
                <div className='h-[100%] w-[40%] bg-black/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 flex flex-col justify-between'
                    style={{
                        backgroundImage: 'linear-gradient(to bottom, rgba(0,97,255,0.1), rgba(96,239,255,0.3))'
                    }}>

                    <div className="flex items-center border border-white/40 rounded-full overflow-hidden w-full h-[50px]">
                        <input
                            type="text"
                            placeholder="Enter City..."
                            className="flex-1 px-4 bg-transparent text-white placeholder-white/80 outline-none h-full"
                            value={searchCity}
                            onKeyDown={handleKeyPress}
                            onChange={(e) => setSearchCity(e.target.value)}
                        />
                        <div className="h-6 w-px bg-white/40 ml-2"></div>
                        <button className="px-4 h-[100%] bg-transparent text-white hover:bg-white/10 transition" onClick={fetchWeatherByCity}>
                            <Search size={20} />
                        </button>
                    </div>

                    {searchData && (
                        <div className=" h-[90%]  flex flex-col items-center justify-between  ">
                            <div className="w-[60%]">
                                <img src={`src/components/assets/${getWeatherIcon(searchData.weather[0].main)}`} className="object-cover h-full w-full" />
                            </div>


                            <div className="text-center">
                                <h2 className="text-white text-2xl font-bold">{searchData.weather[0].main}</h2>
                                <h2 className="text-white text-xl mb-5">{searchData.name.toUpperCase()} ({searchData.sys.country})</h2>
                                <h1 className="font-poppins text-6xl text-white font-bold mb-4">{Math.round(searchData.main.temp)}°</h1>

                            </div>



                            <div className="w-full flex justify-center gap-8">
                                <div className=" h-[90px] w-[40%] bg-white/10 backdrop-blur-sm rounded-xl flex flex-col items-center justify-between p-3">
                                    <p className="text-white font-poppins font-extralight text-xl">Humidity</p>
                                    <h1 className="font-poppins text-2xl font-semibold text-white">{searchData.main.humidity}%</h1>
                                </div>
                                <div className=" h-[90px] w-[40%] bg-white/10 backdrop-blur-sm  rounded-xl flex flex-col items-center justify-between p-3">
                                    <p className="text-white font-poppins font-extralight text-xl ">Wind</p>
                                    <h1 className="font-poppins text-2xl  font-semibold text-white">{Math.round(searchData.wind.speed * 3.6)} Km/h</h1>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Weather;
