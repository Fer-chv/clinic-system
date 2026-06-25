import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import { useAuthStore } from '@/stores/authStore'
import Login from '@/pages/login/Login'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/dashboard/Dashboard'
import Patients from '@/pages/patients/Patients'
import Doctors from '@/pages/doctors/Doctors'
import Appointments from '@/pages/appointments/Appointments'
import ClinicalRecords from '@/pages/appointments/ClinicalRecords'
import Inventory from '@/pages/inventory/Inventory'
import Invoices from '@/pages/invoices/Invoices'
import Reports from '@/pages/reports/Reports'
import Earnings from '@/pages/earnings/Earnings'
import Settings from '@/pages/admin/Settings'
import Users from '@/pages/admin/Users'
import './styles/globals.css'
import './styles/inputs.css'

function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
}

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <ConfigProvider locale={esES}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/clinical" element={<ClinicalRecords />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
