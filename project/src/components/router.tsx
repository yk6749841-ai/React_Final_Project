import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import LoginGuard from "./guard/loginGuard";
import Dashboard from "./dashboard";
import NewTicketPage from "./NewTicketPage";
import GetTheComments from "./getCommentsPage";
import PostThecomment from "./postCommentsPage";
import AdminView from "./adminView";
import SearchPage from "./search";
import PermissionGuard from "./guard/PermissionGuard";
import UpdateStatusComponent from "./ticketUpdateStatus";
import TicketIDPage from "./ticketIDPage";
import TicketsListPage from "./ticketsListPage";

const router_ = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <LoginGuard>
        <Dashboard />
      </LoginGuard>
    ),
    children: [
      {
        element: <PermissionGuard allowedRoles={['customer', 'agent', 'admin']} />,
        children: [
          { path: 'tickets', element: <TicketsListPage /> },
          { path: 'tickets/:id', element: <TicketIDPage /> },
          { path: 'tickets/new', element: <NewTicketPage /> },
          { path: 'addcomment/:id', element: <PostThecomment /> },
          { path: 'comments/:id', element: <GetTheComments /> },
          { path: 'search', element: <SearchPage /> }
        ]
      },
      {
        element: <PermissionGuard allowedRoles={['admin', 'agent']} />,
        children: [
          { path: 'updateStatus/:id', element: <UpdateStatusComponent /> }
        ]
      },
      {
        element: <PermissionGuard allowedRoles={['admin']} />,
        children: [
          { path: 'delete/:id', element: <AdminView /> } 
        ]
      }
    ]
  },
  {
    path: '*',
    element: <div>Page Not Found 404</div>
  }
]);

export default router_;