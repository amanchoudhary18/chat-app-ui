import React, { useContext } from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Chat from "./sections/Chat";
import { UserContext, UserProvider } from "./context/UserContext";
import SidebarMenu from "./sections/SidebarMenu";
import Messages from "./sections/Messages";

const Layout = () => {
  const { selectedChat } = useContext(UserContext);
  return (
    <div className="lg:h-screen grid grid-cols-12">
      <div className="lg:col-span-3 col-span-12 bg-[#1b0036] text-white">
        <SidebarMenu />
      </div>

      <div className="lg:hidden col-span-12 min-h-[500px]">
        <Messages />
      </div>

      <div
        className={`bg-[#f1f1f3] ${
          selectedChat ? "block col-span-12" : "hidden"
        } lg:block lg:col-span-6`}
      >
        <Outlet />
      </div>

      <div className="lg:col-span-3 hidden lg:block h-screen">
        <Messages />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path="channels" element={<Chat />} />
            <Route path="archived" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
