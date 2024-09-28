import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import ClassPage from "./page/class/ClassPage";
import CreateQuestion from "./page/class/CreateQuestion";
import { useSession } from "./hooks/UseSession";

// root component for the landing page to check if the user is authenticated or not and render the appropriate component
const LandingPageRoot = () => {
  const { session } = useSession();
  if (session.loading) return <div>Loading...</div>;
  if (!session.loading && !session.authenticated) return <LandingPage />;
  if (!session.loading && session.authenticated) return <Home />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageRoot />,
  },
  {
    path: "/class/:slug",
    element: <ClassPage />,
  },
  {
    path: "/class/:slug/create",
    element: <CreateQuestion />,
  },
]);

const App = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <RouterProvider router={router} />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
