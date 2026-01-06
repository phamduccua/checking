import { useEffect, useState } from "react";
import { getByUsername } from "../service/log";

const SUBJECT_LABELS = {
  py: "Python",
  trr: "Toán rời rạc",
  "ai-challenge": "AI Challenge",
};

/**
 * Danh sách app rủi ro
 */
const riskyBrowsers = [
  /chrome/i,
  /coccoc/i,
  /edge|msedge/i,
  /firefox/i,
  /brave/i,
];
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


const riskyApps = [
  ...riskyBrowsers,
  ...riskyMessengers,
];


export default function LogsModal({ username, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getByUsername(username);
        setLogs(data.items || data);
      } catch (err) {
        console.error("Fetch logs failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [username]);

  /**
   * Ưu tiên App rủi ro > Flag
   */
  const getRowClass = (log) => {
    const isRiskyApp = riskyApps.some((pattern) =>
      pattern.test(log.appName || "")
    );

    if (isRiskyApp) {
      return "bg-red-500/10 hover:bg-red-500/20";
    }

    const isFlagged = log.flag && log.flag !== "NORMAL";

    if (isFlagged) {
      return "bg-yellow-500/10 hover:bg-yellow-500/20";
    }

    return "hover:bg-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-4/5 max-w-5xl rounded-lg border border-gray-700 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold">
            Logs của user:{" "}
            <span className="text-blue-400">{username}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-auto">
          {loading ? (
            <div className="py-10 text-center text-gray-400">
              Đang tải logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              Không có log
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">App</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-center">Subject</th>
                  <th className="px-3 py-2 text-center">Flag</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isRiskyApp = riskyApps.some((pattern) =>
                    pattern.test(log.appName || "")
                  );

                  const isFlagged =
                    log.flag && log.flag !== "NORMAL";

                  return (
                    <tr
                      key={log.id}
                      className={`border-t border-gray-700 ${getRowClass(
                        log
                      )}`}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(log.logTime).toLocaleString("vi-VN")}
                      </td>

                      <td className="px-3 py-2">
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
                        {isFlagged ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
