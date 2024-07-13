import React, {Fragment, useEffect, useState} from 'react';
import useFetchQuizzes from "../utils/QuizService/useFetchQuizzes";
import {QuizCard} from "../components/QuizCard";
import Header from "../components/Header";
import Pagination from "../components/Pagination";

const HomePage = () => {
    const data = useFetchQuizzes(null).data;
    const [filtered, setFiltered] = useState(data);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filtered?.slice(indexOfFirstPost, indexOfLastPost);
    // Setting initial loading state
    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
        if (data) {
            setLoading(false)
            console.log(data)
        }
    }, [data]);
    useEffect(() => {
        if (!search) {
            setFiltered(data);

        } else if (data) {
            // Fetch quizzes based on the search text
            // Update the implementation based on your backend or data source
            const filteredQuizzes = data.filter((quiz) =>
                quiz.title.toLowerCase().includes(search.toLowerCase()) ||
                quiz.desc.toLowerCase().includes(search.toLowerCase())
            );

            setFiltered(filteredQuizzes);
        }
    }, [search, data]);


    const handleSearchChange = (newSearch) => {
        setSearch(newSearch);
    };

    // Rendering the component
    if (isLoading) {
        // Loading state
        return (
            <Fragment>
                <Header onSearchChange={handleSearchChange}/>
                <div className="container text-center mt-5">
                    <p className="lead">Loading ...</p>
                </div>
            </Fragment>
        );
    }

    return (
        <>
            <Header onSearchChange={handleSearchChange}/>
            <div className="align-items-center m-lg-5">
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {currentPosts?.map(quiz => (
                        <QuizCard key={quiz.id} quiz={quiz}/>
                    ))}
                </div>
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={filtered.length}
                        paginate={(pageNumber) => setCurrentPage(pageNumber)}
                    />
                </div>
            </div>
        </>
    );

}
export default HomePage;
