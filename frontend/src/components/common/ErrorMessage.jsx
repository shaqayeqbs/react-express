import React from "react";
import Button from "./Button";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="text-center p-15 bg-white rounded-xl shadow-lg max-w-md mx-auto my-24">
      <div className="text-6xl mb-5">⚠️</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Oops! Something went wrong
      </h3>
      <p className="text-base text-gray-600 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
