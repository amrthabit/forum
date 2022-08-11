import { useState, useEffect } from "react";

// get window size (width), required useEffect with next.js
// usage -> const [size] = useDeviceSize();

const widthToSize = (width) => {
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
  const [size, setSize] = useState("xs");

  const handleWindowResize = () => {
    setSize(widthToSize(window.innerWidth));
  };

  useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  });

  return [size];
};

export default useDeviceSize;
