import { useEffect, useState } from "react";
import { getLogs, deleteLogsBySubject } from "../service/log";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

/**
 * Trình duyệt
 */
const riskyBrowsers = [
  /chrome/i,
  /coccoc/i,
  /edge|msedge/i,
  /firefox/i,
  /brave/i,
];

/**
 * App nhắn tin / MXH
 */
const riskyMessengers = [
  /zalo/i,
  /messenger/i,
  /facebook\s*messenger/i,
  /telegram|tele/i,
  /instagram|insta/i,
  /whatsapp|whatapp/i,
  /discord/i,
  /skype/i,
  /viber/i,
  /slack/i,
  /teams|microsoft\s*teams/i,
  /line/i,
  /signal/i,
];

const riskyApps = [...riskyBrowsers, ...riskyMessengers];

const SUBJECT_LABELS = {
  py: "Python",
  trr: "Toán rời rạc",
  "ai-challenge": "AI Challenge",
};

export default function LogsPage() {
  const [filters, setFilters] = useState({
    username: "",
    app: "",
    title: "",
    subject: "py",
    flag: "",
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const limit = 30;
  const [offset, setOffset] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs(
        filters.username,
        filters.app,
        filters.title,
        filters.subject,
        filters.flag,
        limit,
        offset
      );
      setLogs(data || []);
    } catch (err) {
      console.error("Fetch logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [offset]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    setOffset(0);
    fetchLogs();
  };

  const handleRefresh = () => {
    setOffset(0);
    fetchLogs();
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteLogsBySubject(filters.subject);
      setShowDeleteModal(false);
      setOffset(0);
      fetchLogs();
    } catch (err) {
      console.error("Delete logs failed:", err);
      alert("Xóa logs thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* Pagination */
  const handlePrevPage = () => {
    if (offset === 0) return;
    setOffset((prev) => Math.max(prev - limit, 0));
  };

  const handleNextPage = () => {
    if (logs.length < limit) return;
    setOffset((prev) => prev + limit);
  };

  /**
   * Ưu tiên App rủi ro > Flag
   */
  const getRowClass = (log) => {
    const isRiskyApp = riskyApps.some(
      (pattern) =>
        pattern.test(log.appName || "") ||
        pattern.test(log.title || "")
    );

    if (isRiskyApp) {
      return "bg-red-500/10 hover:bg-red-500/20";
    }

    const isFlagged = log.flag && log.flag !== "NORMAL";
    if (isFlagged) {
      return "bg-yellow-500/20 hover:bg-yellow-500/30";
    }

    return "hover:bg-gray-800";
  };

  return (
    <div className="space-y-4">
      {/* Filters + Actions */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          <input
            name="username"
            value={filters.username}
            onChange={handleChange}
            className="filter"
            placeholder="Username"
          />

          <input
            name="app"
            value={filters.app}
            onChange={handleChange}
            className="filter"
            placeholder="App name"
          />

          <input
            name="title"
            value={filters.title}
            onChange={handleChange}
            className="filter"
            placeholder="Keyword title"
          />

          <select
            name="subject"
            value={filters.subject}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value="py">Python</option>
            <option value="trr">Toán rời rạc</option>
            <option value="ai-challenge">AI Challenge</option>
          </select>

          <select
            name="flag"
            value={filters.flag}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value="">Tất cả Flag</option>
            <option value="NORMAL">NORMAL</option>
            <option value="REVIEW">REVIEW</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Search
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm disabled:opacity-50"
          >
            Làm mới
          </button>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded text-sm"
        >
          Xóa logs môn hiện tại
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-700 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-center">Username</th>
              <th className="px-3 py-2 text-center">Fullname</th>
              <th className="px-3 py-2 text-center">App</th>
              <th className="px-3 py-2 text-left">Window Title</th>
              <th className="px-3 py-2 text-center">Subject</th>
              <th className="px-3 py-2 text-center">Flag</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              logs.map((log) => {
                const isRiskyApp = riskyApps.some(
                  (pattern) =>
                    pattern.test(log.appName || "") ||
                    pattern.test(log.title || "")
                );

                return (
                  <tr
                    key={log.id}
                    className={`border-t border-gray-700 ${getRowClass(log)}`}
                  >
                    <td className="px-3 py-2 text-gray-400">
                      {new Date(log.time + "Z").toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh"
                      })}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {log.username}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {log.fullname}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {log.appName}
                      {isRiskyApp && (
                        <span className="ml-1 text-red-400 text-xs font-semibold">
                          (Rủi ro)
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2">{log.title}</td>

                    <td className="px-3 py-2 text-center">
                      {SUBJECT_LABELS[log.subject] || log.subject}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {log.flag && log.flag !== "NORMAL" ? (
                        <span className="text-yellow-400 text-xs font-semibold">
                          {log.flag}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Trang {offset / limit + 1}</span>

        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={offset === 0}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
          >
           ← Trước
          </button>

          <button
            onClick={handleNextPage}
            disabled={logs.length < limit}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          title="Xóa logs"
          description="Bạn có chắc chắn muốn xóa toàn bộ logs của môn hiện tại?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
