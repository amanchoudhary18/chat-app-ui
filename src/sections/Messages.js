import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import { formatTime } from "../utils/formatTime";
import { VscPinned } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";

const Messages = () => {
  const location = useLocation();
  const { userData, setSelectedChat, users, searchChat, chats, setChats } =
    useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const existingChatUsers = chats
    .filter((chat) => !chat.isGroupChat)
    .flatMap((chat) => chat.participants);

  const usersWithoutChat = users.filter(
    (user) => user._id !== userData._id && !existingChatUsers.includes(user._id)
  );

  const startNewChat = (selectedUser) => {
    const newChat = {
      _id: Date.now().toString(),
      name: selectedUser.name,
      isGroupChat: false,
      participants: [userData._id, selectedUser._id],
      messages: [],
    };

    setSelectedChat(newChat);

    setChats((prevChats) => [...prevChats, newChat]);
    setIsModalOpen(false);
  };

  const filteredChats = chats
    .filter((chat) => {
      if (location.pathname === "/") return !chat.isGroupChat && !chat.archived;
      if (location.pathname === "/channels")
        return chat.isGroupChat && !chat.archived;
      if (location.pathname === "/archived") return chat.archived;
      return false;
    })
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchChat.toLowerCase())
    );

  const handleSelectChat = (chat) => {
    const updatedChat = {
      ...chat,
      messages: chat.messages.map((message) => {
        if (message.senderId !== userData._id) {
          message.seen = true;
        }

        return message;
      }),
    };
    setSelectedChat(updatedChat);
    setChats((prev) =>
      prev.map((chat) => {
        if (chat._id === updatedChat.id) {
          return updatedChat;
        } else {
          return chat;
        }
      })
    );
  };

  return (
    <div className="px-3 mt-5">
      <div className="flex justify-between items-center mb-5">
        <p className="font-bold text-lg my-1">Messages</p>
        {usersWithoutChat.length > 0 && location.pathname === "/" && (
          <div
            className="w-7 h-7 bg-green-500 flex justify-center items-center rounded-full"
            role="button"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus size={15} />
          </div>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-lg font-semibold mb-5">Start a New Chat</h2>
            {usersWithoutChat.length > 0 ? (
              usersWithoutChat.map((user) => (
                <div
                  key={user._id}
                  className="p-2 px-0 hover:bg-gray-100 cursor-pointer rounded-md flex gap-2 items-center pt=3"
                  onClick={() => startNewChat(user)}
                >
                  <img
                    src={user.profileImage}
                    alt="Chat Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <p>{user.name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No new users available</p>
            )}
          </Modal>
        )}
      </div>

      <SearchBar />

      <div className="w-full mt-10">
        {filteredChats.length === 0 && (
          <p className="text-purple-600 text-center font-medium text-sm">
            No chats to show
          </p>
        )}
        {filteredChats.length > 0 &&
          filteredChats.map((chat) => {
            const otherParticipantId = chat.participants.find(
              (participant) => participant !== userData?._id
            );

            const profileImage = users.find(
              (user) => user._id === otherParticipantId
            )?.profileImage;

            const lastMessage =
              chat.messages.length > 0
                ? chat.messages.sort((a, b) => b.time - a.time)[0]
                : null;

            const unseenMessageCount = chat.messages.filter(
              (message) => !message.seen && message.senderId !== userData?._id
            ).length;

            return (
              <div
                key={chat._id}
                className={`grid grid-cols-10 items-center gap-4 my-6 w-full h-min-[50px] hover:bg-blue-50 p-2 rounded-lg ${
                  chat.archived ? "opacity-75" : ""
                }`}
                role="button"
                onClick={() => handleSelectChat(chat)}
              >
                <div className="col-span-2 flex">
                  {chat.isGroupChat ? (
                    <img
                      src="/assets/avatars/group-icon.png"
                      alt="group"
                      className="w-10 h-10 rounded-full bg-purple-200 object-cover"
                    />
                  ) : (
                    <img
                      src={profileImage || "/assets/avatars/default.jpg"}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>

                <div className="col-span-5">
                  <p className="font-medium text-md truncate">{chat.name}</p>
                  {lastMessage && (
                    <p
                      className={`text-sm truncate ${
                        !lastMessage.seen &&
                        lastMessage.senderId !== userData._id
                          ? "text-black font-medium"
                          : "text-slate-500"
                      }`}
                    >
                      {lastMessage.text}
                    </p>
                  )}
                </div>

                {lastMessage && (
                  <div className="col-span-3 text-right h-full pt-1">
                    <p className="text-xs text-slate-400 mb-auto">
                      {formatTime(lastMessage.time)}
                    </p>

                    <div className="justify-end flex gap-2 items-end  mt-2">
                      {chat.pinned && (
                        <VscPinned className="text-slate-400" size="20" />
                      )}
                      {!lastMessage.seen && unseenMessageCount > 0 && (
                        <div className="bg-black w-5 h-5 text-xs rounded-full text-white flex items-center justify-center">
                          {unseenMessageCount}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
