import { useEffect, useState } from "react";
import { getStats, getFlaggedLogs } from "../service/log";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("py");
  const [total_flagged, setTotalFlagged] = useState(0);
  const [flaggedLogs, setFlaggedLogs] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 30;

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getStats(subject);
      setTotalFlagged(res.flagged_logs);

      setStats([
        {
          label: "Tổng log thu thập",
          value: res.total_logs,
          desc: "Tất cả hành vi ghi nhận",
        },
        {
          label: "Log bị gắn cờ",
          value: res.flagged_logs,
          desc: "Có dấu hiệu nghi vấn",
        },
        {
          label: "User cần xem xét",
          value: res.users_need_review,
          desc: "Có ≥ 1 nghi vấn",
        },
      ]);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlagged = async () => {
    try {
      const res = await getFlaggedLogs(subject, limit, page * limit);
      setFlaggedLogs(res);
    } catch (err) {
      console.error("Failed to load flagged logs", err);
    }
  };

  const handleRefresh = () => {
    setPage(0);
    fetchStats();
    fetchFlagged();
  };

  useEffect(() => {
    fetchStats();
  }, [subject]);

  useEffect(() => {
    fetchFlagged();
  }, [subject, page]);

  useEffect(() => {
    setPage(0);
  }, [subject]);

  if (loading) {
    return <div className="text-gray-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* FILTER SUBJECT + REFRESH (LEFT, GỘP CHUNG) */}
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm text-gray-400">Lọc chủ đề:</label>

        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="
        bg-gray-800 border border-gray-700
        rounded px-3 py-1.5
        text-sm
        focus:outline-none focus:ring-1 focus:ring-blue-500
      "
          >
            <option value="py">Python</option>
            <option value="trr">Toán rời rạc</option>
            <option value="ai-challenge">AI-Challenge</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Làm mới dữ liệu"
            className="
        px-3 py-1.5
        bg-gray-700 hover:bg-gray-600
        border border-gray-700
        rounded
        text-sm
        disabled:opacity-50
        transition
      "
          >
            <span className={loading ? "animate-spin inline-block" : ""}>
              Làm mới
            </span>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-800 border border-gray-700 rounded p-4"
          >
            <div className="text-sm text-gray-400">{s.label}</div>
            <div className="text-3xl font-bold mt-1">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* RECENT FLAGS */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <div className="font-semibold mb-3">Log nghi vấn gần nhất</div>

        {flaggedLogs.length === 0 ? (
          <div className="text-sm text-gray-500 italic">
            Không có log nghi vấn
          </div>
        ) : (
          <ul className="text-sm space-y-2">
            {flaggedLogs.map((log, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  <span className="font-semibold">{log.username}</span> – 
                  <span className="font-semibold ml-1">{log.fullname}</span> – 
                  <span className="text-yellow-400 ml-1">{log.title}</span>
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(log.time + "Z").toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh"
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* PAGINATION */}
        <div className="mt-3 flex justify-between items-center">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="text-xs text-gray-400 hover:text-white disabled:opacity-30"
          >
            ← Trước
          </button>

          <span className="text-xs text-gray-500">Trang {page + 1}</span>

          <button
            disabled={flaggedLogs.length + limit * page >= total_flagged}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-gray-400 hover:text-white disabled:opacity-30"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}
