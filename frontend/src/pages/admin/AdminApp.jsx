import { Admin, Resource } from "react-admin";
import AdminLayout from "./AdminLayout";
import Invoices from "./Invoices";
import Dashboard from "./Dashboard";
import Products from "./Products";

const AdminApp = () => (
  <Admin
    layout={AdminLayout}
    basename="/admin"
  >
    <Resource name="users" list={Invoices} />
    <Resource name="products" list={Products} />
    <Resource name="orders" />
  </Admin>
);

export default AdminApp;