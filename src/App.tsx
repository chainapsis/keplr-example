import React from "react";

import { OsmosisTab } from "./components/OsmosisTab";
import { EthermintTab } from "./components/EthermintTab";
import { EvmTab } from "./components/EvmTab";
import { StarknetTab } from "./components/StarknetTab";
import { BitcoinTab } from "./components/BitcoinTab";
import { DeeplinkTab } from "./components/DeeplinkTab";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";
import "./styles/tabs.css";
import "./styles/typography.css";

type TabType =
  | "osmosis"
  | "ethermint"
  | "evm"
  | "starknet"
  | "bitcoin"
  | "deeplink";

function App() {
  const [activeTab, setActiveTab] = React.useState<TabType>("osmosis");

  const isExperimental = React.useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("experimental") === "true";
  }, []);

  const tabs = React.useMemo(() => {
    const all = [
      { id: "osmosis", label: "Osmosis" },
      { id: "ethermint", label: "Ethermint", experimental: true },
      { id: "evm", label: "EVM" },
      { id: "starknet", label: "Starknet" },
      { id: "bitcoin", label: "Bitcoin" },
      { id: "deeplink", label: "Deeplink" },
    ];
    return all.filter((t) => !t.experimental || isExperimental);
  }, [isExperimental]);

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
        {tabs.map((tab) => (
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
      {activeTab === "ethermint" && <EthermintTab />}
      {activeTab === "evm" && <EvmTab />}
      {activeTab === "starknet" && <StarknetTab />}
      {activeTab === "bitcoin" && <BitcoinTab />}
      {activeTab === "deeplink" && <DeeplinkTab />}
    </div>
  );
}

export default App;
