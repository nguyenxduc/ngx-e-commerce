# Admin Components

Bộ component dành cho Admin Dashboard của ứng dụng E-commerce.

## Components

### 1. AdminLayout

Layout chính cho admin dashboard với sidebar và navbar.

```tsx
import { AdminLayout } from "./components/admin";

// Sử dụng trong App.tsx
<Route path="admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboardPage />} />
  <Route path="dashboard" element={<AdminDashboardPage />} />
  <Route path="users" element={<AdminUsersPage />} />
  {/* ... other admin routes */}
</Route>;
```

### 2. AdminNavbar

Navigation bar cho admin với notifications và profile dropdown.

```tsx
import { AdminNavbar } from "./components/admin";

<AdminNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />;
```

### 3. AdminSidebar

Sidebar với menu navigation và quick stats.

```tsx
import { AdminSidebar } from "./components/admin";

<AdminSidebar isOpen={isSidebarOpen} />;
```

### 4. AdminStatsCard

Card hiển thị thống kê với icon và thay đổi.

```tsx
import { AdminStatsCard } from "./components/admin";
import { Users, TrendingUp } from "lucide-react";

<AdminStatsCard
  title="Total Users"
  value="2,350"
  change="+20.1%"
  changeType="positive"
  icon={Users}
  iconColor="text-blue-600"
  description="Active users this month"
/>;
```

### 5. AdminDataTable

Bảng dữ liệu với search, sort, pagination và actions.

```tsx
import { AdminDataTable } from "./components/admin";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          value === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    ),
  },
];

<AdminDataTable
  columns={columns}
  data={users}
  title="Users"
  searchable
  filterable
  actions={{ view: true, edit: true, delete: true }}
  onSearch={handleSearch}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  pagination={{
    currentPage: 1,
    totalPages: 10,
    onPageChange: handlePageChange,
  }}
/>;
```

### 6. AdminModal

Modal component với các kích thước khác nhau.

```tsx
import { AdminModal } from "./components/admin";

<AdminModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Add New User"
  size="lg"
>
  <form>{/* Form content */}</form>
</AdminModal>;
```

### 7. AdminBreadcrumb

Breadcrumb navigation tự động hoặc tùy chỉnh.

```tsx
import { AdminBreadcrumb } from './components/admin';

// Tự động từ URL
<AdminBreadcrumb />

// Tùy chỉnh
<AdminBreadcrumb
  items={[
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Add User' }
  ]}
/>
```

### 8. AdminNotificationSystem

Hệ thống thông báo với các loại khác nhau.

```tsx
import { AdminNotificationSystem, Notification } from "./components/admin";

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Order Completed",
    message: "Order #12345 has been completed successfully",
    timestamp: new Date(),
    read: false,
  },
];

<AdminNotificationSystem
  notifications={notifications}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
  onMarkAllAsRead={handleMarkAllAsRead}
  onClearAll={handleClearAll}
/>;
```

### 9. AdminSearchBar

Search bar với global search và keyboard shortcuts.

```tsx
import { AdminSearchBar } from "./components/admin";

<AdminSearchBar
  onSearch={handleSearch}
  placeholder="Search users, products, orders..."
  searchResults={searchResults}
  onResultSelect={handleResultSelect}
  loading={isSearching}
/>;
```

## Tính năng chính

### 1. Responsive Design

- Tất cả components đều responsive
- Sidebar có thể ẩn/hiện trên mobile
- Mobile overlay khi sidebar mở

### 2. Keyboard Shortcuts

- `Cmd/Ctrl + K`: Mở global search
- `Escape`: Đóng modal/dropdown
- Arrow keys: Navigate trong search results

### 3. Accessibility

- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 4. Customization

- Theme colors có thể tùy chỉnh
- Icon library: Lucide React
- Tailwind CSS classes

## Cài đặt

1. Đảm bảo đã cài đặt dependencies:

```bash
npm install lucide-react
```

2. Import và sử dụng components:

```tsx
import {
  AdminLayout,
  AdminNavbar,
  AdminSidebar,
  AdminStatsCard,
  AdminDataTable,
  AdminModal,
  AdminBreadcrumb,
  AdminNotificationSystem,
  AdminSearchBar,
} from "./components/admin";
```

## Best Practices

1. **State Management**: Sử dụng Zustand hoặc Context API cho global state
2. **Error Handling**: Implement error boundaries cho admin pages
3. **Loading States**: Hiển thị loading states cho async operations
4. **Validation**: Validate form inputs trước khi submit
5. **Security**: Implement proper authentication và authorization
6. **Performance**: Sử dụng React.memo và useMemo khi cần thiết

## Contributing

Khi thêm component mới:

1. Tạo file component trong thư mục `admin/`
2. Export trong `index.ts`
3. Thêm TypeScript interfaces
4. Viết documentation
5. Test responsive và accessibility
