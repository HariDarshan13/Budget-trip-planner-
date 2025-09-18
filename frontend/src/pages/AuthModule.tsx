import Navigation from '@/components/Navigation';

const AuthModule = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-semibold mb-4">User Authentication Module</h1>
        <p>Includes Signup/Login, session management, and save & retrieve itineraries.</p>
        <ul className="list-disc ml-6 mt-4">
          <li>Placeholder forms for Signup / Login (use react-hook-form).</li>
          <li>Use JWT or server sessions in backend; store token in HttpOnly cookie.</li>
          <li>Itinerary persistence endpoints: GET /itineraries, POST /itineraries</li>
        </ul>
        <p className="mt-4 italic">(This page is a scaffold. See code comments for integration hints.)</p>
      </main>
    </div>
  );
};

export default AuthModule;
