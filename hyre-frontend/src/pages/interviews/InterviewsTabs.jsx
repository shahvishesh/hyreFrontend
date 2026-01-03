import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import InterviewList from "./InterviewList";
import LiveInterviews from "./LiveInterviews";

const TABS = [
  { label: "LIVE", key: "Live" },
  { label: "TODAY", key: "Today" },
  { label: "UPCOMING", key: "Upcoming" },
  { label: "COMPLETED", key: "Completed" },
  { label: "EXPIRED", key: "Expired" },
];

export default function InterviewsTabs() {
  const [activeTab, setActiveTab] = useState("Live");

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            value={tab.key}
          />
        ))}
      </Tabs>

      {activeTab === "Live" ? (
        <LiveInterviews />
      ) : (
        <InterviewList tab={activeTab} />
      )}
    </Box>
  );
}
