import React from "react";

import { OsmosisTab } from "./components/OsmosisTab";
import { EvmTab } from "./components/EvmTab";
import { StarknetTab } from "./components/StarknetTab";
import { BitcoinTab } from "./components/BitcoinTab";
import { DeeplinkTab } from "./components/DeeplinkTab";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";
import "./styles/tabs.css";
import "./styles/typography.css";

type TabType = "osmosis" | "evm" | "starknet" | "bitcoin" | "deeplink";

function App() {
  const [activeTab, setActiveTab] = React.useState<TabType>("osmosis");

  return (
    <div className="root-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <img
          src="/keplr-logo.png"
          style={{ maxWidth: "200px" }}
          alt="keplr-logo"
        />
      </div>

      <div className="tabs-navigation">
        {[
          { id: "osmosis", label: "Osmosis" },
          { id: "evm", label: "EVM" },
          { id: "starknet", label: "Starknet" },
          { id: "bitcoin", label: "Bitcoin" },
          { id: "deeplink", label: "Deeplink" },
        ].map((tab) => (
          <button
            key={tab.id}
            className="keplr-button tab-button"
            onClick={() => setActiveTab(tab.id as TabType)}
            style={activeTab === tab.id ? undefined : { opacity: 0.7 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "osmosis" && <OsmosisTab />}
      {activeTab === "evm" && <EvmTab />}
      {activeTab === "starknet" && <StarknetTab />}
      {activeTab === "bitcoin" && <BitcoinTab />}
      {activeTab === "deeplink" && <DeeplinkTab />}
    </div>
  );
}

export default App;
