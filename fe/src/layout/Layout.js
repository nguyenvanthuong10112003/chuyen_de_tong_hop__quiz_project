import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export const Layout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Trạng thái Sidebar
    const [activeItem, setActiveItem] = useState(); // Trạng thái mục được chọn
    useEffect(() => {
        const pathNameSplit = document.location.pathname.split('/');   
        setActiveItem(pathNameSplit[1].trim().length == 0 ? 'home' : pathNameSplit[1]);
        
    })
    return <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
            isExpanded={isSidebarExpanded}
            toggleSidebar={setIsSidebarExpanded}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
        />

        {/* Nội dung chính */}
        <div
            className={`flex-1 w-full transition-all duration-300 ${isSidebarExpanded ? "pl-64" : "pl-16"
                }`}
        >
            <div >
                {/* Navbar */}
                <Navbar />
                <div className="bg-purple-50 w-full min-h-full py-2 pt-[68px]">
                    <div className="container mx-auto bg-white p-4 rounded-sm pt-[60px]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </div>
}