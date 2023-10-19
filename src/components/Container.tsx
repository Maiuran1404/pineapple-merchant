import clsx from "clsx";
import React from "react";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8",
      )}
    >
      {children}
    </div>
  );
}

export default Container;
