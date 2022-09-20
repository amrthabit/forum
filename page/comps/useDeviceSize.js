import { useState, useEffect } from "react";

// get window size (width), required useEffect with next.js
// usage -> const [size] = useDeviceSize();

const widthToSize = () => {
  const width = window.innerWidth;
  if (width < 450) {
    return "xs";
  } else if (width < 600) {
    return "sm";
  } else if (width < 900) {
    return "md";
  } else if (width < 1200) {
    return "lg";
  } else {
    return "xl";
  }
};

const useDeviceSize = () => {
  const [size, setSize] = useState("sm");

  const handleWindowResize = () => {
    setSize(widthToSize());
  };
  useEffect(() => {
    // component is mounted and window is available
    setSize(widthToSize());
    window.addEventListener("resize", handleWindowResize, true);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return [size];
};

export default useDeviceSize;
