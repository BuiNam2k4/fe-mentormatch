import React, { useState, useEffect } from "react"
import RevenueChart from "../../components/admin/RevenueChart"
import IssueTable from "../../components/admin/IssueTable"
import StatCards from "../../components/admin/StatCards"
import adminService from "../../services/adminService"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats()
        if (res.code === 1000) {
          setStats(res.result)
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="pb-10 font-sans flex items-center justify-center py-20">
        <div className="text-slate-400 text-sm">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="pb-10 font-sans">
      <RevenueChart stats={stats} />
      <IssueTable />
      <StatCards stats={stats} />
    </div>
  )
}
