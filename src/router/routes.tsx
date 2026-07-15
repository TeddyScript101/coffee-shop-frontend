import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { HealthCheckWrapper } from '@components/HealthCheckWrapper'
import { Spinner } from '@ds/components/Spinner/Spinner'

const HomePage = lazy(() => import('@pages/HomePage').then((m) => ({ default: m.HomePage })))
const CoffeeListPage = lazy(() => import('@pages/CoffeeListPage').then((m) => ({ default: m.CoffeeListPage })))
const EquipmentListPage = lazy(() => import('@pages/EquipmentListPage').then((m) => ({ default: m.EquipmentListPage })))
const ProductDetailPage = lazy(() => import('@pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const LoginPage = lazy(() => import('@pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const MembershipDashboardPage = lazy(() => import('@pages/MembershipDashboardPage').then((m) => ({ default: m.MembershipDashboardPage })))
const AdminProductsPage = lazy(() => import('@pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })))
const WarmingUpPage = lazy(() => import('@pages/WarmingUpPage').then((m) => ({ default: m.WarmingUpPage })))
const BackendRedirectPage = lazy(() => import('@pages/BackendRedirectPage').then((m) => ({ default: m.BackendRedirectPage })))
const CartPage = lazy(() => import('@pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('@pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('@pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })))
const AccountPage = lazy(() => import('@pages/AccountPage').then((m) => ({ default: m.AccountPage })))

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <HealthCheckWrapper>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </HealthCheckWrapper>
  )
}
