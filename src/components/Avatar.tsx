import Image from "next/image";
import { useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useOutsideClickEvent } from "~/hooks/useOutsideClickEvent";
import { useUser } from "~/providers/UserProvider";

function Avatar() {
  const ref = useRef(null);
  const { user, signOut } = useUser();
  const [expanded, setExpanded] = useState(false);
  useOutsideClickEvent(ref, () => setExpanded(false));

  if (!user) return null;

  const { displayName, photoURL, email } = user;

  function toggleDropdown() {
    setExpanded(!expanded);
  }

  return (
    <div ref={ref} onClick={toggleDropdown} className="relative">
      <div className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full bg-gray-400 hover:opacity-80">
        {photoURL ? (
          <Image src={photoURL} fill alt={displayName ?? "Profile picture"} />
        ) : (
          <div />
        )}
      </div>

      {expanded && (
        <div className="absolute -bottom-2 right-0 z-50 w-56 translate-y-full divide-y divide-gray-300 rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="px-3 pb-2 pt-3">
            <div className="group block flex-shrink-0">
              <div className="flex items-center">
                <div>
                  {photoURL && (
                    <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full">
                      <Image src={photoURL} fill alt="Profile picture" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 py-2">
            <button
              className="flex w-full items-center justify-between gap-3 rounded-md p-2 hover:bg-gray-100 hover:text-red-500"
              onClick={() => void signOut()}
            >
              <BiLogOut size={20} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Avatar;
