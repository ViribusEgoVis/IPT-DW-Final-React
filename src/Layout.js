// Layout.js
import Header from "./components/Header";
import React from "react";
import {Outlet} from "react-router-dom";

const Layout = () => {

    return (
        <>
            <Header toggleSearch={false}/>
            <div className={'wrapper'}>
                <Outlet/>
            </div>
        </>
    );
};

export default Layout;
