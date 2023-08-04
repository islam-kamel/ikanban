import { useMemo } from "react";
import { PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

export const useKeySensor = () => {
  // check if the user is using a mobile
  const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []);

  const sensor = isMobile ? TouchSensor : PointerSensor;
  const mobileOption = {
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  };
  const desktopOption = {
    activationConstraint: {
      distance: 2
    }
  };
  const option = isMobile ? mobileOption : desktopOption;

  return useSensors(useSensor(sensor, option));
};
