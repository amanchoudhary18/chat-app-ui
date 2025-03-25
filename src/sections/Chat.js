import React, { useContext, useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/formatTime";
import { UserContext } from "../context/UserContext";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import {
  IoArchiveOutline,
  IoCheckmark,
  IoCheckmarkDone,
} from "react-icons/io5";
import NoSelectedChat from "./NoSelectedChat";
import { RiResetLeftFill } from "react-icons/ri";

const Chat = () => {
  const { userData, selectedChat, users, setSelectedChat, setChats } =
    useContext(UserContext);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);

  const profileImages = users
    .filter(
      (user) =>
        selectedChat?.participants.includes(user._id) &&
        user._id !== userData?._id
    )
    .map((user) => user.profileImage);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      text: messageText,
      time: Math.floor(Date.now() / 1000),
      seen: false,
      senderId: userData?._id,
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

    setSelectedChat(updatedChat);

    setChats((prev) =>
      prev.map((chat) => (chat._id === selectedChat._id ? updatedChat : chat))
    );

    setMessageText("");
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = selectedChat.messages.filter((_, i) => i !== index);
    const updatedChat = { ...selectedChat, messages: updatedMessages };
    setSelectedChat(updatedChat);

    setChats((prev) =>
      prev.map((chat) => (chat._id === selectedChat._id ? updatedChat : chat))
    );

    setContextMenu(null);
  };

  const handleArchiveChat = () => {
    const updatedChat = { ...selectedChat, archived: true, pinned: false };
    setChats((prev) =>
      prev.map((chat) => (chat._id === selectedChat._id ? updatedChat : chat))
    );

    setSelectedChat(null);
  };

  const handleRestoreChat = () => {
    const updatedChat = { ...selectedChat, archived: false, pinned: false };
    setChats((prev) =>
      prev.map((chat) => (chat._id === selectedChat._id ? updatedChat : chat))
    );

    setSelectedChat(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  if (!selectedChat) return <NoSelectedChat />;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center border-b bg-white/30 backdrop-blur-lg shadow-b-sm p-2 py-4">
        <div className="flex items-center gap-3">
          <div className="flex">
            {profileImages.slice(0, 3).map((img, index) => (
              <img
                src={img}
                key={index}
                alt="Chat Avatar"
                className={`w-10 h-10 rounded-full ${index > 0 ? "-ms-3" : ""}`}
              />
            ))}
          </div>

          <div>
            <p className="font-semibold text-lg">{selectedChat?.name}</p>
            {profileImages.length > 3 && (
              <p className="m-0 text-green-500 text-xs">
                + {profileImages.length - 3} others
              </p>
            )}
          </div>
        </div>

        {selectedChat.archived ? (
          <div
            className="text-green-500 pe-3 flex gap-2 items-center"
            role="button"
            onClick={handleRestoreChat}
          >
            <RiResetLeftFill size={20} />
            <p className="text-black hover:text-green-500">Restore</p>
          </div>
        ) : (
          <div
            className="text-red-500 pe-3 flex gap-2 items-center"
            role="button"
            onClick={handleArchiveChat}
          >
            <IoArchiveOutline size={20} />
            <p className="text-black hover:text-red-500">Archive</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 pt-5 custom-scrollbar scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200">
        <div className="space-y-4">
          {selectedChat?.messages
            .sort((a, b) => a.time - b.time)
            .map((message, index) => {
              const isMyMessage = message.senderId === userData?._id;
              const senderData = users.find(
                (user) => user._id === message.senderId
              );

              return (
                <div
                  key={index}
                  className={`flex pb-2 ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 ${
                      isMyMessage ? "flex-row-reverse" : "flex-row"
                    } relative`}
                  >
                    <img
                      src={senderData.profileImage}
                      alt="Chat Avatar"
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      {selectedChat.isGroupChat && (
                        <p
                          className={`${
                            isMyMessage ? "text-right" : ""
                          } font-medium`}
                        >
                          {senderData.name}
                        </p>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg shadow-md relative ${
                            isMyMessage ? "bg-[#d5efc2]" : "bg-[#eddbdb]"
                          }`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (!isMyMessage) return;
                            const messageRect =
                              e.currentTarget.getBoundingClientRect();

                            setContextMenu({
                              index,
                              x: messageRect.right - 100,
                              y: messageRect.bottom + 5,
                            });
                          }}
                        >
                          <p>{message.text}</p>
                          <div className="flex items-center justify-end text-xs opacity-75 mt-1">
                            <span>{formatTime(message.time)}</span>
                            {isMyMessage &&
                              (!message.seen ? (
                                <span className="ml-1 text-blue-500">
                                  <IoCheckmark size={18} />
                                </span>
                              ) : (
                                <span className="ml-1 text-blue-500">
                                  <IoCheckmarkDone size={18} />
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {contextMenu && (
        <div
          className="absolute bg-white shadow-lg rounded-md p-2 z-50 text-red-600 hover:bg-red-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="flex items-center gap-2 px-2 py-1 w-full text-sm"
            onClick={() => handleDeleteMessage(contextMenu.index)}
          >
            <FaTrash size={14} /> Delete
          </button>
        </div>
      )}

      <div className="relative mx-5 p-3 flex items-center gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="w-full p-3 pl-4 text-sm border border-slate-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          role="button"
        />
        <div
          onClick={sendMessage}
          className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-all duration-300"
          role="button"
        >
          <FaPaperPlane size={18} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
