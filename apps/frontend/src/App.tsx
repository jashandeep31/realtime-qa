import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import ClassPage from "./page/class/ClassPage";
import CreateQuestion from "./page/class/CreateQuestion";
import { useSession } from "./hooks/UseSession";
import CreateClass from "./page/class/CreateClass";
import SocketProvider from "./providers/SocketProvider";
import { Toaster } from "sonner";
import { QuestionPage } from "./page/class/QuestionPage";
import { ThemeProvider } from "./providers/ThemeProvider";
import AdminClassView from "./page/class/admin/AdminClassView";
// root component for the landing page to check if the user is authenticated or not and render the appropriate component
const LandingPageRoot = () => {
  const { session } = useSession();
  if (session.loading) return <div>Loading...</div>;
  if (!session.loading && !session.authenticated) return <LandingPage />;
  if (!session.loading && session.authenticated) return <Home />;
};

// TODO: protect out routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageRoot />,
  },
  {
    path: "/create",
    element: <CreateClass />,
  },
  {
    path: "/class/:slug",
    element: <ClassPage />,
  },
  {
    path: "/class/:classSlug/admin",
    element: <AdminClassView />,
  },
  {
    path: "/class/:slug/create",
    element: <CreateQuestion />,
  },
  {
    path: "/class/:slug/:id",
    element: <QuestionPage />,
  },
]);

const App = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SocketProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Toaster richColors />
            <main className="flex-1">
              <RouterProvider router={router} />
            </main>
            <Footer />
          </div>
        </SocketProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
