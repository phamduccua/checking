import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login as loginService } from "../service/auth"
export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await loginService(username, password);
      localStorage.setItem("token", response.token.trim());
      localStorage.setItem("role", response.role);
      navigate("/");
    } catch (error) {
        setError("Đăng nhập thất bại, vui lòng thử lại!");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center text-blue-400">
          Admin Login
        </h1>

        {error && (
          <div className="text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm outline-none"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition rounded py-2 text-sm font-semibold"
        >
          Đăng nhập
        </button>

        <div className="text-xs text-gray-500 text-center">
          * Chỉ dành cho quản trị viên
        </div>
      </form>
    </div>
  )
}
