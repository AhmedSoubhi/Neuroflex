import React from "react";
import './Main.scss';
import Hand from "../img/hand.png";
import design from "../img/design.png";
import design2 from "../img/design2.png";
import design3 from "../img/design3.png";
import design4 from "../img/des.jpg";
import design5 from "../img/feedback.jpg";
import design6 from "../img/de.png";

const Main = () => {
  return (
    <>
      <div className="outer-wrapper">
        <header className="header">
          <div>
            <h1>Transforming Hand Rehabilitation with the Smart Glove</h1>
            <p>Experience innovative hand rehabilitation with our smart glove interface. 
              Track your progress, receive real-time feedback,
              and access personalized exercises for a faster recovery.</p>
            <img src={Hand} alt="Hand rehabilitation smart glove" />
          </div>
        </header>
      </div>

      <div className="outer-wrapper">
        <header className="idea">
          <div>
            <h2>Revolutionary Smart Glove Technology for Effective Hand Rehabilitation</h2>
            <p>Our smart glove technology offers a groundbreaking approach to hand rehabilitation, providing seamless integration, real-time feedback, progress tracking, and user support.</p>
            <img src={design} alt="Smart Glove design" />
            <img src={design2} alt="Smart Glove design 2" />
            <img src={design3} alt="Smart Glove design 3" />
            <ul>
              <li>Seamless Integration of Sensors for Enhanced Rehabilitation Experience</li>
              <li>Real-Time Feedback for Accurate and Effective Exercise Performance</li>
              <li>Track Your Progress and Achievements Throughout the Rehabilitation Journey</li>
            </ul>
          </div>
        </header>
      </div>
      <div className="outer-wrapper">
        <header className="header2">
          <div>
            <h1>Customize Your Hand<br></br>Rehabilitation Exercises to <br></br>Meet Your Needs</h1>
            <p>The exercise section offers a variety of hand rehabilitation 
                exercises tailored to your specific needs.
                 You can also customize your workout plan based on your preferences.</p>
                 <img src={design4} alt="" />
          </div>
        </header>
      </div>
      <div className="outer-wrapper">
        <header className="header3">
          <div>
            <h1>Real-Time Feedback for<br></br>Accurate Exercise<br></br>Execution</h1>
            <p>Our smart glove provides real-time feedback to ensure correct exercise execution, maximizing rehabilitation outcomes.</p>
            <p>Improve Form<br></br><br></br>Receive immediate visual and audio cues to guide your exercise technique.</p>
            <p>Track Progress<br></br><br></br>Monitor your improvements in finger motion and grip strength throughout your rehabilitation journey.</p>
                 <img src={design5} alt="" />
          </div>
        </header>
      </div>
      <div className="outer-wrapper">
        <header className="header4">
          <div>
            <h1>Track Your Progress and<br></br>Achieve Rehabilitation<br></br> Goals</h1>
            <p>Our progress tracking tools provide patients and therapists with valuable insights to monitor and enhance rehabilitation progress. With real-time feedback and visualization of improvements, you can confidently work towards your recovery goals.</p>
            <p>Real-time<br></br><br></br>Get instant feedback on your exercise forms and make adjustments for optimal performance.</p>
            <p>Visualize<br></br><br></br>Track your progress throughout the rehabilitation period and witness improvements in finger motion and grip strength.</p>
                 <img src={design6} alt="" />
          </div>
        </header>
      </div>
    </>
  );
}

export default Main;
