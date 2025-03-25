import React from "react";

const NoSelectedChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-5">
      <img
        src="/assets/NoChat.svg"
        alt="No Chat Selected"
        className="w-[80%] h-[80%] transition-all duration-500 ease-in-out"
      />

      <p className="mt-4 text-lg  animate-fade-in font-bold">
        No conversation selected.
      </p>
      <span className="text-[#753cad] text-xs ">
        Pick a chat and start connecting!
      </span>
    </div>
  );
};

export default NoSelectedChat;
