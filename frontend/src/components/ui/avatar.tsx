import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  className = "",
  children,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        onError={handleImageError}
        className={`w-10 h-10 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ${className}`}
    >
      {children || fallback || "U"}
    </div>
  );
};

export const AvatarImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className={`w-10 h-10 rounded-full object-cover ${className}`}
    />
  );
};

export const AvatarFallback: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ${className}`}
    >
      {children}
    </div>
  );
};
