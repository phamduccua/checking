import { useState, useEffect } from "react";
import { Modal, Input, Typography, message } from "antd";
import { registerUsers } from "../service/user";

const { Text, Paragraph } = Typography;

export default function AddUserModal({ open, onClose, onSuccess }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setInput("");
    }
  }, [open]);

  const handleSubmit = async () => {
    // Parse input
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      message.error("Dữ liệu trống");
      return;
    }

    const users = [];

    for (const line of lines) {
      const parts = line.split(/\s+/);

      // username + fullname + password
      if (parts.length < 3) {
        message.error(`Sai định dạng: "${line}"`);
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
      message.success(`Thêm thành công ${users.length} user(s)`);
      onSuccess(); // reload list
      onClose();
    } catch {
      message.error("Thêm user thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm User"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Thêm user"
      cancelText="Hủy"
      width={600}
    >
      <div style={{ padding: "12px 0" }}>
        <Paragraph type="secondary">
          Nhập mỗi user trên một dòng theo định dạng:
          <br />
          <Text code>username fullname password</Text>
        </Paragraph>

        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={`vd:\nadmin Admin User 123456\ntest01 Nguyễn Văn A abc@123`}
        />
      </div>
    </Modal>
  );
}
