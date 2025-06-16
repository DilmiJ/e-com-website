const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg">
          <h2 className="font-semibold text-lg mb-2">📦 Manage Inventory</h2>
          <p className="text-sm">View, add, edit, or remove products.</p>
        </div>
        <div className="bg-white p-4 rounded shadow hover:shadow-lg">
          <h2 className="font-semibold text-lg mb-2">🛒 Orders</h2>
          <p className="text-sm">Track and manage customer orders.</p>
        </div>
        <div className="bg-white p-4 rounded shadow hover:shadow-lg">
          <h2 className="font-semibold text-lg mb-2">👥 Users</h2>
          <p className="text-sm">View all registered users.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
