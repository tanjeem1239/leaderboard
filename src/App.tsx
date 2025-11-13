import { useState, useEffect } from 'react';
import BragDocumentSlide from './components/BragDocumentSlide';
import AttendanceSlide from './components/AttendanceSlide';
import BragRemainingSlide from './components/BragRemainingSlide';
import AttendanceRemainingSlide from './components/AttendanceRemainingSlide';
import './App.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { component: <BragDocumentSlide />, name: 'Brag Documents' },
    { component: <AttendanceSlide />, name: 'Attendance' },
    { component: <BragRemainingSlide />, name: 'Brag Rankings' },
    { component: <AttendanceRemainingSlide />, name: 'Attendance Rankings' },
  ];

  // Auto-rotate slides every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="app">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={slide.name}
            className={`slide-wrapper ${index === currentSlide ? 'active' : ''}`}
          >
            {slide.component}
          </div>
        ))}
      </div>

      <div className="navigation">
        <div className="slide-indicators">
          {slides.map((slide, index) => (
            <button
              key={slide.name}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              title={slide.name}
              aria-label={`Go to ${slide.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

