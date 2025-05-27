import React from 'react'
import Hero from '../components/Layout/hero'
import CategorySection from '../components/Products/CategorySection'
import NewArrivals from '../components/Products/NewArrivals'

const Home = () => {
  return (
    <div>
        <Hero />
        <CategorySection />
        <NewArrivals/>
    </div>
  )
}

export default Home