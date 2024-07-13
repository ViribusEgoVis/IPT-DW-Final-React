import React from "react";
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import SignInPage from "./pages/login/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/user/AccountPage";
import Quiz from "./pages/quiz/Quiz";
import MyQuizzesPage from "./pages/user/MyQuizzesPage";
import EditQuiz from "./pages/quiz/EditQuiz";
import CreateQuiz from "./pages/quiz/CreateQuiz";

function App() {

    const PrivateRoute = ({element}) => {
        if (sessionStorage.getItem('isAuthed') === 'true') {
            return element;
        } else {
            // Redirect to login if not authenticated
            return <Navigate to="/login"/>;
        }
    };


    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route element={<Layout/>}>
                    <Route path="/login" element={<SignInPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                    <Route path="/quiz/:id" element={<Quiz/>}/>

                </Route>
                <Route element={<PrivateRoute element={<Layout/>}/>}>
                    <Route path="/account" element={<AccountPage/>}/>
                    <Route path="/myquizzes" element={<MyQuizzesPage/>}/>
                    <Route path="/quiz/edit/:id" element={<EditQuiz/>}/>
                    <Route path="/quiz/create" element={<CreateQuiz/>}/>
                </Route>
            </Routes>
        </BrowserRouter>


    );
}

export default App;

