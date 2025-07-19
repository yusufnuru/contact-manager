import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import App from "../components/App.tsx";

export const Route = createRootRoute({
  component: () => {
    return (<>
      <div className="p-2 flex gap-2">
        <App></App>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>)
  },
})
