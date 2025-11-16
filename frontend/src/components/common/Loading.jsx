import React from "react";

const Loading = ({ text = "Loading...", fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      {text && <p className="text-gray-600 text-base">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-screen items-center justify-center">{content}</div>
    );
  }

  return content;
};

export default Loading;
