import React from "react";

type Props = {
  text?: string;
  children?: React.ReactNode;
  classNames?: string[];
  // rest props type
  [x: string]: unknown;

}

function Button({ text, classNames, children, ...props }: Props) {
  const baseClasses = [
    "h-[60px]",
    "w-[350px]",
    "min-w-[350px]",
    "cursor-pointer",
    "rounded-lg",
    "bg-primary",
    "p-4",
    "border",
    "border-primary",
    "hover:border-buttonHoverBorderColor",
    "transition",
    "duration-300",
    "backdrop-blur"
  ];

  let classes = classNames ? [...classNames, ...baseClasses].join(" ") : baseClasses.join(" ");

  // unique classes
  classes = classes.split(" ").filter((value, index, self) => {
    return self.indexOf(value) === index || value.startsWith(self[index].split("-")[0]);
  }).join(" ");

  return (
    <>
      <button
        className={classes}
        {...props}
      >
        {children || text}
      </button>
    </>
  );
}

export default Button;
