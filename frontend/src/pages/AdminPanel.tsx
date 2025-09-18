import Navigation from '@/components/Navigation';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-semibold mb-4">Admin Panel</h1>
        <p>Monitor user plans; add/remove destinations or hotels; analytics dashboard.</p>
        <p className="mt-4 italic">Optional: protect this route behind an admin auth guard.</p>
      </main>
    </div>
  );
};

export default AdminPanel;
