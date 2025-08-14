/**
 * Utility functions for Codeforces integration
 */

/**
 * Get the URL for a Codeforces user's profile picture
 * @param handle The Codeforces handle
 * @param size The size of the avatar in pixels (default: 100)
 * @returns URL string for the profile picture
 */
export const getCodeforcesProfilePicture = (
  handle: string,
  size: number = 100
): string => {
  if (!handle) return "";
  // Format: https://avatar.codeforces.com/{first_letter_of_handle}/{handle}/avatar/{size}.jpg
  return `https://avatar.codeforces.com/${handle[0].toLowerCase()}/${handle.toLowerCase()}/avatar/${size}.jpg`;
};

/**
 * Generate a fallback avatar URL with user initials
 * @param name The user's name or email
 * @returns URL string for the fallback avatar
 */
export const getFallbackAvatar = (name: string): string => {
  if (!name) return "";

  // Extract initials from name or email
  const initials = name
    .split(/[\s@.]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  // Generate a consistent color based on the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=${hue},70%,50%&color=fff&size=100`;
};
