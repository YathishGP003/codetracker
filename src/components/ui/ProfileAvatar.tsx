import React from "react";
import { User } from "lucide-react";

type ProfileAvatarProps = {
  imageUrl?: string;
  alt?: string;
  size?: number; // pixel size of the outer circle
  className?: string;
  onClick?: () => void;
  variant?: "solid" | "ring"; // visual style
};

/**
 * ProfileAvatar renders a circular gradient button with a User icon.
 * If imageUrl is provided and loads, it shows the image inside.
 * This is the single source of truth for profile visuals across the app.
 */
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  alt = "Profile",
  size = 40,
  className = "",
  onClick,
  variant = "solid",
}) => {
  const [broken, setBroken] = React.useState(false);
  const showImg = Boolean(imageUrl) && !broken;

  const outerStyle: React.CSSProperties = {
    width: size,
    height: size,
  };

  // create a thin gradient ring by adding small padding
  const ringPadding = variant === "ring" ? 2 : 0; // px
  const innerSize = Math.max(0, size - ringPadding * 2);
  const iconSize = Math.round(size * 0.45);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-gradient-to-b from-blue-400 to-blue-700 ${className}`}
      style={outerStyle}
      aria-label={alt}
    >
      {variant === "solid" ? (
        // Full gradient circle; clip image/icon directly
        showImg ? (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
            onError={() => setBroken(true)}
          />
        ) : (
          <User color="white" style={{ width: iconSize, height: iconSize }} />
        )
      ) : (
        // Ring variant: thin gradient ring with inner content
        <div
          className="rounded-full overflow-hidden flex items-center justify-center bg-transparent"
          style={{ width: innerSize, height: innerSize }}
        >
          {showImg ? (
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover rounded-full"
              onError={() => setBroken(true)}
            />
          ) : (
            <User color="white" style={{ width: iconSize, height: iconSize }} />
          )}
        </div>
      )}
    </button>
  );
};

export default ProfileAvatar;
