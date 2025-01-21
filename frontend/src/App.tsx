import React, {ReactNode} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
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
import {RequireAuth} from "./router/RequireAuth.tsx";
import {PageNotFound} from "./pages/PageNotFound.tsx";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

    // Ukryj menu na stronach logowania i rejestracji

    return (
        <>
             <TopMenu />
            {children}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <UserProvider>
                <CartProvider>
                        <Routes>
                            <Route path={PathNames.anonymous.register} element={<RegisterForm />} />
                            <Route path={PathNames.anonymous.login} element={<LoginForm />} />

                            <Route path={PathNames.authenticated.products} element={
                                <RequireAuth allowedRoles={["WORKER", "CLIENT"]}>
                                    <Layout>
                                        <Products />
                                    </Layout>
                                </RequireAuth>
                            }/>

                            <Route path={PathNames.authenticated.orders} element={
                                <RequireAuth allowedRoles={['WORKER', 'CLIENT']}>
                                    <Layout>
                                        <Orders />
                                    </Layout>
                                </RequireAuth>
                            } />

                            <Route path={PathNames.client.cart} element={
                               <RequireAuth allowedRoles={['CLIENT']}>
                                   <Layout>
                                        <CartPage />
                                   </Layout>
                                </RequireAuth>
                            } />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                </CartProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
