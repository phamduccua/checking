export default function ConfirmDeleteModal({
  subjectLabel,
  onConfirm,
  onCancel,
  loading,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-lg border border-gray-700 shadow-lg">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-yellow-400">
            Xác nhận xóa logs
          </h2>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-sm">
          <p>
            Bạn có chắc chắn muốn xóa <b>TẤT CẢ</b> logs của môn: {subjectLabel}
          </p>
          <p className="text-yellow-400">
            ⚠️Khi ấn xóa sẽ <b>KHÔNG THỂ hoàn tác</b>.
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm text-gray-400 hover:text-white"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              px-4 py-1
              bg-yellow-600 hover:bg-yellow-700
              text-black font-semibold
              rounded
              disabled:opacity-50
            "
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
