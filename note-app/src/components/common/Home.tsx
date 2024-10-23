import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./NavBar";

const Home: React.FC = () => {
  const location = useLocation();
  return (
    <div className="w-[100%] h-[100vh]">
      {/* Navbar */}
      <Navbar path={location.pathname}/>
      {/* content */}
      <div className="flex justify-center align-center h-[92%] py-5">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] rounded-xl p-5 shadow-xl flex flex-col gap-4 items-center justify-center">
          <h1 className="text-3xl font-bold text-brown-900">QuickNotes</h1>
          <div className="font-medium flex flex-col items-center text-brown-900">
            <p>Keep your notes organized and</p>
            <p>accessible at all times.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
