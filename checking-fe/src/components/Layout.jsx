import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token / thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang login
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 text-xl font-bold text-blue-400">
          Log Admin
        </div>

        <nav className="space-y-1 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded block ${
                isActive
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `px-3 py-2 rounded block ${
                isActive
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-700"
              }`
            }
          >
            Logs
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `px-3 py-2 rounded block ${
                isActive
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-700"
              }`
            }
          >
            Users
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="text-sm text-gray-300">
            Admin
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              text-sm
              px-3 py-1.5
              bg-red-600 hover:bg-red-700
              rounded
              transition
            "
          >
            Đăng xuất
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
