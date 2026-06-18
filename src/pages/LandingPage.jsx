import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import JobCategories from '../components/landing/JobCategories';
import FeaturedJobs from '../components/landing/FeaturedJobs';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

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