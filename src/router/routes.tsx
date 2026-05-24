import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { HealthCheckWrapper } from '@components/HealthCheckWrapper'
import { HomePage } from '@pages/HomePage'
import { CoffeeListPage } from '@pages/CoffeeListPage'
import { EquipmentListPage } from '@pages/EquipmentListPage'
import { ProductDetailPage } from '@pages/ProductDetailPage'
import { LoginPage } from '@pages/LoginPage'
import { RegisterPage } from '@pages/RegisterPage'
import { MembershipDashboardPage } from '@pages/MembershipDashboardPage'
import { AdminProductsPage } from '@pages/admin/AdminProductsPage'
import { WarmingUpPage } from '@pages/WarmingUpPage'

export function AppRoutes() {
  return (
    <HealthCheckWrapper>
      <Routes>
        <Route path="/warming-up" element={<WarmingUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/coffee" element={<CoffeeListPage />} />
        <Route path="/equipment" element={<EquipmentListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/membership"
          element={
            <PrivateRoute>
              <MembershipDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute requireAdmin>
              <AdminProductsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </HealthCheckWrapper>
  )
}
