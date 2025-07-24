import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Dashoard from "./pages/Dashoard";
import Products from "./pages/Products";

import Categories from "./pages/Categories";
import Base from "./pages/Base";
import Users from "./pages/Users";
import Shapes from "./pages/Shapes";




export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashoard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="shapes" element={<Shapes />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="base" element={<Base />} />
                  
                </Route>
            </Routes>
        </Router>
    );
}
