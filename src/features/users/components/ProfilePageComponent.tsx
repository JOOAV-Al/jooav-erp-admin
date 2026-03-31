"use client"
import UserDeleteConfirmation from "@/features/users/components/UserDeleteConfirmation";
import UserProfileUpdate from "@/features/users/components/UserProfileUpdate";
import { useState } from "react";

type ActiveView = "profile" | "delete";
const ProfilePageComponent = () => {
  const [activeView, setActiveView] = useState<ActiveView>("profile");
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  return (
    <div className="px-xl pt-xl pb-main flex flex-col gap-7">
      <div className="max-w-[500px] mx-auto bg-white w-full rounded-3xl shadow-card flex flex-col">
        <div className="flex items-center gap-5 px-xl pt-[24px] pb-[16px]">
          <div
            onClick={() => handleViewChange("profile")}
            className={`px-md py-5 cursor-pointer ${activeView === "profile" ? "bg-border-main shadow-input" : ""} h-5.5 rounded-md flex items-center justify-center`}
          >
            <h4
              className={`font-medium text-[15px] tracking-[0.04em] leading-[1.2] text-body`}
            >
              Profile
            </h4>
          </div>
          <div
            onClick={() => handleViewChange("delete")}
            className={`p-main cursor-pointer ${activeView === "delete" ? "bg-border-main shadow-input" : ""} h-5.5 rounded-md flex items-center justify-center`}
          >
            <h4
              className={`font-medium text-[15px] tracking-[0.04em] leading-[1.2] text-body`}
            >
              Delete account
            </h4>
          </div>
        </div>

        <>
          {activeView === "profile" && (<UserProfileUpdate />)}
          {activeView === "delete" && (<UserDeleteConfirmation />)}
        </>
      </div>
    </div>
  );
};

export default ProfilePageComponent;
