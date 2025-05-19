import { ErrorBoundary } from "react-error-boundary";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import * as Pages from "./pages";
import Layout from "./layouts/Layout";
import AppProviders from "./pages/AppProviders";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" />,
        },
        {
          path: "/home",
          element: <Pages.HomePage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/authenticate",
          element: <Pages.AuthPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "*",
          element: <Pages.ErrorPage is404={true} />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
      ],
    },
  ]);

  return (
    <AppProviders>
      <RouterProvider router={router}>
        <ErrorBoundary
          FallbackComponent={(props) => <Pages.ErrorPage {...props} />}
        />
      </RouterProvider>
    </AppProviders>
  );
}
