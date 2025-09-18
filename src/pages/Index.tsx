import Navbar from '../components/Layout/Navbar';
import DashboardView from '../components/Dashboard/DashboardView';

const Index = () => {
  return (
    <div className="min-h-screen bg-background dotted-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardView />
      </main>
    </div>
  );
};

export default Index;
