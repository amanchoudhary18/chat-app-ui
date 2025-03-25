import React, { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../context/UserContext";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const { setSearchChat } = useContext(UserContext);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchChat(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div className="relative w-full mx-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full p-3 pl-12 text-sm border border-slate-200 rounded-full shadow-lg 
                   focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-700 text-xl transition-all duration-300" />
    </div>
  );
};

export default SearchBar;
