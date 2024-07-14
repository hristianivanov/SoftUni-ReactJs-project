import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Blogs from '../Components/Blogs'
import Search from '../Components/Search'

function Home() {
    return (
        <>
            <Header />
            <Search/>
            <Blogs />
            <Footer />
        </>
    )
}

export default Home
