import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  if (!token || role !== "ADMIN") {
    return <Navigate to="/login" replace />
  }

  return children
}
