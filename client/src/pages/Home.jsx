import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <JobListing />
        <AppDownload />
      </main>
      <Footer />
    </>
  )
}

export default Home