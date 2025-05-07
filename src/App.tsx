import React from "react";

import { OsmosisTab } from "./components/OsmosisTab";
import { EvmTab } from "./components/EvmTab";
import { StarknetTab } from "./components/StarknetTab";
import { BitcoinTab } from "./components/BitcoinTab";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";
import "./styles/tabs.css";

type TabType = "osmosis" | "evm" | "starknet" | "bitcoin";

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
        ].map((tab) => (
          <button
            key={tab.id}
            className="keplr-button tab-button"
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              backgroundColor: activeTab === tab.id ? undefined : "#3C3C3C",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "osmosis" && <OsmosisTab />}
      {activeTab === "evm" && <EvmTab />}
      {activeTab === "starknet" && <StarknetTab />}
      {activeTab === "bitcoin" && <BitcoinTab />}
    </div>
  );
}

export default App;
