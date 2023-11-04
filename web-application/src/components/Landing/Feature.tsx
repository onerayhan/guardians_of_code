import { useState, FC } from "react";
import { motion } from "framer-motion";
import VisibilitySensor from "react-visibility-sensor";

interface FeatureProps {
  icon: string;
  title: string;
}

const Feature: FC<FeatureProps> = ({ icon, title }) => {
  const variant = {
    visible: {
      transform: "scale(1)",
    },
    hidden: {
      transform: "scale(0.5)",
    },
  };

  const [elementIsVisible, setElementIsVisible] = useState(false);

  return (
    <VisibilitySensor
      onChange={(isVisible: boolean | ((prevState: boolean) => boolean)) => setElementIsVisible(isVisible)}
    >
      <div className="feature flex items-center justify-center flex-col relative text-center mx-12">
        {/* icon */}
        <motion.div
          variants={variant}
          transition={{
            duration: 1,
            type: "ease-out",
          }}
          animate={elementIsVisible ? "visible" : "hidden"}
          className="icon bg-[#081730] rounded-2xl p-4"
        >
          <img
            src={`img/${icon}.png`}
            alt=""
            className="w-[3rem]"
          />
        </motion.div>

        <span className="mt-5">{title}</span>

        <span className="text-[#707070] mt-4">
          You can see what your friends are listening and you will get friend recommendations based
          on your music taste.
        </span>
      </div>
    </VisibilitySensor>
  );
}

export default Feature;