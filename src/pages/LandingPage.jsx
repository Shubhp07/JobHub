import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import JobCategories from '../components/JobCategories';
import FeaturedJobs from '../components/FeaturedJobs';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <JobCategories />
      <FeaturedJobs />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

export default LandingPage;