"use client";
import React, { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  //FaUser,
  FaBookOpen,
  FaCalendarAlt,
  //FaBell,
  FaCogs,
  FaUserCheck,
  //FaEdit,
  //FaKey,
} from "react-icons/fa";

import STHeader from "@/app/facultyMember/components/STHeader";
import STFooter from "@/app/facultyMember/components/STFooter";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", path: "/admin/Dashboard", icon: <FaHome /> },
    //{ name: "View Profile", path: "/admin/AdminProfile", icon: <FaUser /> },
    { name: "View Courses", path: "/admin/AdminCourse2", icon: <FaBookOpen /> },
    {
      name: "View Calendar",
      path: "/admin/AdminCalendaViewPage",
      icon: <FaCalendarAlt />,
    },
    // { name: "Notification", path: "/admin/Notification", icon: <FaBell /> },
    {
      name: "Course Management",
      path: "/admin/CourseManagement_2",
      icon: <FaCogs />,
    },
    {
      name: "Attendance Management",
      path: "/admin/AttendanceManagement",
      icon: <FaUserCheck />,
    },
    //{ name: "Edit Account Details", path: "/admin/AdminEditAccountPage", icon: <FaEdit /> },
    //{ name: "Change Password", path: "/admin/AdminChangePassword", icon: <FaKey /> },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Imported Header */}
      <STHeader />

      {/* Main layout with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 text-white p-4 overflow-y-auto">
          <nav>
            <ul className="space-y-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all duration-200
                        ${
                          isActive
                            ? "bg-slate-700 border-l-4 border-teal-400 text-white font-semibold"
                            : "hover:bg-slate-700 text-slate-200"
                        }`}
                    >
                      {link.icon}
                      {link.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto text-black">{children}</main>
      </div>

      {/* Imported Footer */}
      <STFooter />
    </div>
  );
};

export default Layout;
