import React, { useState, useEffect } from 'react';

// --- Configuration ---

// 1. Define asset paths relative to the public folder
const imageAssets = {
  morning: ['/header-images/morning-1.jpg', '/header-images/morning-2.jpg'],
  noon:    ['/header-images/noon-1.jpg', '/header-images/noon-2.jpg'],
  evening: ['/header-images/evening-1.jpg', '/header-images/evening-2.jpg'],
  night:   ['/header-images/night-1.jpg', '/header-images/night-2.jpg'],
};

// 2. Define time ranges (in 24-hour format)
const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour < 12)  return 'morning'; // 5:00 - 11:59
  if (hour >= 12 && hour < 17) return 'noon';    // 12:00 - 16:59
  if (hour >= 17 && hour < 21) return 'evening'; // 17:00 - 20:59
  return 'night';                                // 21:00 - 4:59
};

// 3. How fast should it alternate between the two images? (in milliseconds)
const ALTERNATION_SPEED = 15000; // Every 15 seconds


const DynamicHeader = () => {
  // State to hold the path of the image currently being displayed
  // Initialize with a safe default (e.g., morning 1) to avoid empty render
  const [currentBgImage, setCurrentBgImage] = useState(imageAssets.morning[0]);

  useEffect(() => {
    // A local variable to keep track of alternation (0 or 1)
    // We use a ref or an external variable because if we used state,
    // it would complicate the dependency array of the useEffect.
    let toggleIndex = 0;

    const updateHeaderLogic = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // 1. Determine time slot string (e.g., 'morning')
      const timeSlot = getTimeOfDay(currentHour);

      // 2. Select the appropriate array of 2 images
      const imagePair = imageAssets[timeSlot];

      // 3. Select either the first (index 0) or second (index 1) image based on toggle
      const selectedImage = imagePair[toggleIndex];

      // 4. Update state
      setCurrentBgImage(selectedImage);

      // 5. Flip index for the next tick (if 0 becomes 1, if 1 becomes 0)
      toggleIndex = toggleIndex === 0 ? 1 : 0;
    };

    // Run immediately on mount so we don't wait 15s for the first image
    updateHeaderLogic();

    // Set up the interval to run repeatedly
    const intervalId = setInterval(updateHeaderLogic, ALTERNATION_SPEED);

    // Cleanup function: clear interval when component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);


  // --- Styles ---
  const headerStyle = {
    width: '100%',
    height: '350px', // Adjust desired height
    backgroundImage: `url(${currentBgImage})`,
    backgroundSize: 'cover', // Ensures image covers the area
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out', // Smooth fading effect
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const overlayStyle = {
    // Optional dark overlay to make text readable
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1
  };

  const textStyle = {
    color: 'white',
    fontSize: '3rem',
    fontWeight: 'bold',
    zIndex: 2, // Ensure text is above overlay
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
  };


  return (
    <header style={headerStyle}>
        <div style={overlayStyle}></div>
        <h1 style={textStyle}>Welcome to My World</h1>
    </header>
  );
};

export default DynamicHeader;