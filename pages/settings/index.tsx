import { Layout } from "@/components/Layout";
import BotSettings from "@/components/settings/bot-settings";
import { MapRadiusSettings } from "@/components/settings/radius";
import React from "react";

const Settings = () => {
  return (
    <Layout page={"settings"}>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BotSettings />
        </div>
        <MapRadiusSettings />
      </div>
    </Layout>
  );
};

export default Settings;
