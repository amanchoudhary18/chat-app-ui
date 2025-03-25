import { createContext, useEffect, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [searchChat, setSearchChat] = useState("");
  const [chats, setChats] = useState([]);

  const getUsers = () => {
    fetch("data/users.json")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setUserData(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const getChats = () => {
    fetch("data/chats.json")
      .then((res) => res.json())
      .then((data) => {
        const sortedChats = data
          .map((chat) => ({
            ...chat,
            messages: chat.messages.sort((a, b) => a.time - b.time),
          }))
          .sort((a, b) => b.pinned - a.pinned);

        setChats(sortedChats);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  };

  useEffect(() => {
    getUsers();
    getChats();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        selectedChat,
        setSelectedChat,
        users,
        setUsers,
        searchChat,
        setSearchChat,
        chats,
        setChats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
