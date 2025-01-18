import React, {ReactNode} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import Products from "./pages/Products";
import { PathNames } from "./router/PathNames";
import './App.css'
import TopMenu from './components/TopMenu';
import {UserProvider} from "./context/UserContext.tsx";
import Orders from "./pages/Orders.tsx";
import {CartProvider} from "./context/CartContext.tsx";
import CartPage from "./pages/CartPage.tsx";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    // Ukryj menu na stronach logowania i rejestracji
    const hideMenu =
        location.pathname === PathNames.anonymous.login ||
        location.pathname === PathNames.anonymous.register;

    return (
        <>
            {!hideMenu && <TopMenu />}
            {children}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <UserProvider>
                <CartProvider>
                    <Layout>
                        <Routes>
                            <Route path={PathNames.anonymous.register} element={<RegisterForm />} />
                            <Route path={PathNames.anonymous.login} element={<LoginForm />} />
                            <Route path={PathNames.worker.products} element={<Products />} />
                            <Route path={PathNames.client.products} element={<Products />} />
                            <Route path={PathNames.worker.orders} element={<Orders />} />
                            <Route path={PathNames.client.orders} element={<Orders />} />
                            <Route path={PathNames.client.cart} element={<CartPage />} />
                        </Routes>
                    </Layout>
                </CartProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
