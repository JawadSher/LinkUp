import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScreenType } from "@/features/preferences/screenSlice.js";

export function useScreenSize() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640) dispatch(setScreenType("mobile"));
      else if (width <= 1024) dispatch(setScreenType("tablet"));
      else if (width <= 1440) dispatch(setScreenType("laptop"));
      else dispatch(setScreenType("desktop"));
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
}
