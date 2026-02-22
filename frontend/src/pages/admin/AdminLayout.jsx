import { Layout } from "react-admin";
import AdminSidebar from "../../Components/admin/AdminSidebar";
const AdminLayout = (props) => <Layout {...props} menu={AdminSidebar} />;

export default AdminLayout;