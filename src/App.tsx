import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Userlist from "./pages/Users/Users";
import Users from "./pages/Users/Users";
import Dashoard from "./pages/Dashboard/Dashoard";

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashoard />} />
                    <Route path="users" element={<Users />} />
                </Route>
            </Routes>
        </Router>
    );
}
