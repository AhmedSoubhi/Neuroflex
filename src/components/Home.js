import React from "react";
import Sidebar from '../Feedback/Sidebar';
import Chat from '../Feedback/Chat';

const Home = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>  
        <Chat/>     
      </div>
    </div>
  )
}

export default Home;