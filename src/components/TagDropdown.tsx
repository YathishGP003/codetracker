import React, { useRef, useEffect } from "react";

interface TagDropdownProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  isDarkMode: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TagDropdown: React.FC<TagDropdownProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
  isDarkMode,
  open,
  setOpen,
}) => {
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  return (
    open && (
      <div
        ref={tagDropdownRef}
        className={`absolute z-20 mt-1 left-0 w-full max-h-48 overflow-y-auto rounded border shadow-lg ${
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-slate-100"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      >
        {allTags.length === 0 && (
          <div className="px-3 py-2 text-sm text-gray-400">No tags</div>
        )}
        {allTags.map((tag) => (
          <label
            key={tag}
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            <input
              type="checkbox"
              className="mr-2 accent-blue-500"
              checked={selectedTags.includes(tag)}
              onChange={() => {
                setSelectedTags(
                  selectedTags.includes(tag)
                    ? selectedTags.filter((t) => t !== tag)
                    : [...selectedTags, tag]
                );
              }}
            />
            <span>{tag}</span>
          </label>
        ))}
        <div
          className="px-3 py-2 border-t text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => {
            setSelectedTags([]);
            setOpen(false);
          }}
        >
          Clear all
        </div>
      </div>
    )
  );
};

export default TagDropdown;
