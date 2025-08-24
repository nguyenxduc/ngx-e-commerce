import { useAuthStore } from '@/stores/auth.store';

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Thông tin tài khoản</h1>
      
      <div className="bg-base-100 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Họ và tên:</h3>
            <p>{user.name}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Email:</h3>
            <p>{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <h3 className="font-semibold mb-2">Số điện thoại:</h3>
              <p>{user.phone}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-2">Vai trò:</h3>
            <p className="capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
