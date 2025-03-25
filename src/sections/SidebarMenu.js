import React, { useContext } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiChatDeleteLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SidebarMenu = () => {
  const location = useLocation();
  const { setSelectedChat, chats, userData } = useContext(UserContext);

  const filteredChats = chats.filter((chat) => {
    if (location.pathname === "/") return !chat.isGroupChat && !chat.archived;
    if (location.pathname === "/channels")
      return chat.isGroupChat && !chat.archived;
    if (location.pathname === "/archived") return chat.archived;
    return false;
  });

  const getUnreadCount = () => {
    let count = 0;

    for (const chat of filteredChats) {
      for (const message of chat.messages) {
        if (!message.seen && message.senderId !== userData?._id) {
          count++;
        }
      }
    }

    return count;
  };

  const menu = [
    {
      title: "Messages",
      path: "/",
      icon: <IoChatbubblesOutline size={25} />,
    },
    {
      title: "Groups",
      path: "/channels",
      icon: <FaUserGroup size={25} />,
    },
    {
      title: "Archived Chats",
      path: "/archived",
      icon: <RiChatDeleteLine size={25} />,
    },
  ];

  return (
    <div className="flex flex-col text-lg lg:h-screen my-auto">
      <div className="mx-8 flex lg:flex-col lg:justify-normal lg:mt-20 my-5 flex-row justify-between gap-5 ">
        {menu.map((menuItem) => {
          const isActive = location.pathname === menuItem.path;
          return (
            <div
              key={menuItem.path}
              className={`flex justify-between items-center ${
                isActive ? "text-white" : "text-slate-400"
              } `}
            >
              <div className="flex gap-5">
                <div className="md:block hidden">{menuItem.icon}</div>
                <Link
                  to={menuItem.path}
                  onClick={() => setSelectedChat(null)}
                  className="text-sm lg:text-lg"
                >
                  {menuItem.title}
                </Link>
              </div>

              {isActive && getUnreadCount() > 0 && (
                <div className="w-6 h-6 bg-white text-black rounded-full text-xs justify-center items-center font-bold hidden lg:flex">
                  {getUnreadCount()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenu;
