import { useState } from "react";
import { registerUsers } from "../service/user";

export default function AddUserModal({ onClose, onSuccess }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // Parse input
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setError("Dữ liệu trống");
      return;
    }

    const users = [];

    for (const line of lines) {
      const parts = line.split(/\s+/);

      // username + fullname + password
      if (parts.length < 3) {
        setError(`Sai định dạng: "${line}"`);
        return;
      }

      const username = parts[0];
      const password = parts[parts.length - 1];
      const fullname = parts.slice(1, parts.length - 1).join(" ");

      users.push({ username, fullname, password });
    }

    try {
      setLoading(true);
      await registerUsers(users);
      onSuccess(); // reload list
      onClose();
    } catch (e) {
      setError("Thêm user thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-lg border border-gray-700 shadow-lg">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 flex justify-between">
          <h2 className="font-semibold text-lg">Thêm User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-400">
            Nhập mỗi user trên một dòng theo định dạng:
            <br />
            <code className="text-blue-400">
              username fullname password
            </code>
          </p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder={`vd:
admin Admin User 123456
test01 Nguyễn Văn A abc@123`}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm outline-none"
          />

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-400 hover:text-white"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded text-white disabled:opacity-50"
          >
            {loading ? "Đang thêm..." : "Thêm user"}
          </button>
        </div>
      </div>
    </div>
  );
}
