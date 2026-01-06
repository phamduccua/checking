import { useEffect, useState } from "react";
import { getUser } from "../service/user";
import LogsModal from "../components/LogsModal";
import AddUserModal from "../components/AddUserModal";

const roleColor = {
  ADMIN: "text-purple-400",
  USER: "text-blue-400",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // filter: chỉ user bị gắn cờ
  const [isFlag, setIsFlag] = useState(false);

  // pagination
  const limit = 30;
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // modal states
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      fetchUsers(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // khi bật / tắt filter flag → về trang đầu
  useEffect(() => {
    setOffset(0);
    fetchUsers(0);
  }, [isFlag]);

  // load data
  const fetchUsers = async (customOffset = offset) => {
    try {
      setLoading(true);
      const data = await getUser(query, isFlag, limit, customOffset);

      const list = data.items || data;
      setUsers(list);

      setHasNext(list.length === limit);
    } catch (err) {
      console.error("Fetch users failed", err);
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu & khi đổi trang
  useEffect(() => {
    fetchUsers(offset);
  }, [offset]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>

        <div className="flex gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username hoặc fullname..."
            className="filter w-64"
          />

          {/* Toggle filter flag */}
          <button
            onClick={() => setIsFlag(!isFlag)}
            className={`px-3 py-1 rounded text-sm border
              ${
                isFlag
                  ? "bg-yellow-600 border-yellow-500 text-white"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {isFlag ? "✓ Chỉ user bị gắn cờ" : "Chỉ user bị gắn cờ"}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
          >
            + Thêm user
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-700 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-3 py-2 text-left">Username</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-center">Role</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Log Flagged</th>
              <th className="px-3 py-2 text-center">Detail</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  Không có người dùng
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.username}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-3 py-2 font-semibold">{u.username}</td>

                  <td className="px-3 py-2">{u.fullname}</td>

                  <td
                    className={`px-3 py-2 text-center font-semibold ${roleColor[u.role]}`}
                  >
                    {u.role}
                  </td>

                  <td className="px-3 py-2 text-center">
                    {u.status === 1 ? (
                      <span className="text-green-400">ACTIVE</span>
                    ) : (
                      <span className="text-gray-400">DISABLED</span>
                    )}
                  </td>

                  <td className="px-3 py-2 text-center">
                    {u.totalFlag > 0 ? (
                      <span className="text-yellow-400 font-semibold">
                        {u.totalFlag}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => setSelectedUsername(u.username)}
                      className="text-blue-400 text-xs hover:underline"
                    >
                      Xem logs →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <button
          disabled={offset === 0}
          onClick={() => setOffset(offset - limit)}
          className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
        >
          ← Trước
        </button>

        <button
          disabled={!hasNext}
          onClick={() => setOffset(offset + limit)}
          className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>

      {/* Logs Modal */}
      {selectedUsername && (
        <LogsModal
          username={selectedUsername}
          onClose={() => setSelectedUsername(null)}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setOffset(0);
            fetchUsers(0);
          }}
        />
      )}
    </div>
  );
}
