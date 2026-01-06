const students = [
  {
    name: "Nguyễn Văn A",
    logs: 124,
    violations: 5,
    severity: "HIGH",
  },
  {
    name: "Trần Thị B",
    logs: 98,
    violations: 1,
    severity: "LOW",
  },
]

const severityColor = {
  HIGH: "text-red-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-green-400",
}

export default function Students() {
  return (
    <div className="overflow-auto border border-gray-700 rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 text-gray-400">
          <tr>
            <th className="px-3 py-2 text-left">Thí sinh</th>
            <th className="px-3 py-2 text-center">Số log</th>
            <th className="px-3 py-2 text-center">Vi phạm</th>
            <th className="px-3 py-2 text-center">Đánh giá</th>
            <th className="px-3 py-2 text-center">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="border-t border-gray-700 hover:bg-gray-800">
              <td className="px-3 py-2">{s.name}</td>
              <td className="px-3 py-2 text-center">{s.logs}</td>
              <td className="px-3 py-2 text-center">{s.violations}</td>
              <td className={`px-3 py-2 text-center font-semibold ${severityColor[s.severity]}`}>
                {s.severity}
              </td>
              <td className="px-3 py-2 text-center">
                <button className="text-blue-400 hover:underline text-xs">
                  Xem logs
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
