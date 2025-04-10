
import React, { useEffect, useRef } from "react";
import { Tabs, Tab } from "@mui/material";

type TabsProps = {
  triggers: { title: string; value: string }[];
  storageKey: string;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  fn?: () => void;
};

export default function CustomTabs({
  triggers,
  storageKey,
  fn,
  selectedTab,
  setSelectedTab,
}: TabsProps) {
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const selectedTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTab = sessionStorage.getItem(storageKey);
    if (storedTab && storageKey) {
      setSelectedTab(storedTab);
    } else {
      setSelectedTab(triggers?.[0]?.value);
    }
  }, [setSelectedTab, storageKey, triggers]);

  useEffect(() => {
    if (selectedTabRef.current && tabContainerRef.current) {
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [selectedTab]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    sessionStorage.setItem(storageKey, newValue);
    if (fn) fn();
  };

  return (
    <div className="w-full flex px-1 items-center justify-start tab_width rounded-lg no_scroll overflow-x-auto h-[51px] relative scroll-smooth no-scrollbar bg-white"
    >
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="custom animated tabs"
        TabIndicatorProps={{ style: { backgroundColor: "#FF2735", height: 3 } }} // Green indicator
      >
        {triggers.map((trigger) => (
          <Tab
            key={trigger.value}
            label={trigger.title}
            value={trigger.value}
            color={selectedTab === trigger.value ? "success" : "inherit"}
            sx={{
              textTransform: "none",
              color: selectedTab === trigger.value ? "#FF2735" : "#343940",
              // fontWeight: selectedTab === trigger.value ? "bold" : "normal",
              "&:hover": { color: "#FF2735" },
            }}
          />
        ))}
      </Tabs>
    </div>
  );
}
