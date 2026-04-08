import React from "react";

const TagInputExplainerBanner = () => {
  return (
    <div className=" py-md px-main gap-[8px] rounded-lg bg-[#F7F7F7]">
      <p className="leading-[1.5] tracking-[0.04em] font-medium text-sm text-body-passive">
        To record multiple entries, press a{" "}
        <span className="text-heading">“,”</span> after each entry, then press{" "}
        <span className="text-heading">“enter”</span> to save all entries.
      </p>
    </div>
  );
};

export default TagInputExplainerBanner;
