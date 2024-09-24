import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import ClassPage from "./page/class/ClassPage";
import CreateQuestion from "./page/class/CreateQuestion";

const LandingPageRoot = () => {
  const isLogin = true;
  if (!isLogin) return <LandingPage />;
  return <Home />;
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
