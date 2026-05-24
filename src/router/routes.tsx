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
import { BackendRedirectPage } from '@pages/BackendRedirectPage'
import { CartPage } from '@pages/CartPage'
import { CheckoutPage } from '@pages/CheckoutPage'
import { OrderConfirmationPage } from '@pages/OrderConfirmationPage'
import { AccountPage } from '@pages/AccountPage'

export function AppRoutes() {
  return (
    <HealthCheckWrapper>
      <Routes>
        <Route path="/warming-up" element={<WarmingUpPage />} />
        <Route path="/swagger" element={<BackendRedirectPage backendPath="/swagger" />} />
        <Route path="/scalar"  element={<BackendRedirectPage backendPath="/scalar"  />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/coffee" element={<CoffeeListPage />} />
        <Route path="/equipment" element={<EquipmentListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <PrivateRoute>
              <OrderConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />
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
