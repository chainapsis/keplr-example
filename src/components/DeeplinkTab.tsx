export const DeeplinkTab: React.FC = () => {
  const openKeplrMobile = () => {
    window.open("https://deeplink.keplr.app/", "_blank");
  };

  const openKeplrInAppBrowser = () => {
    window.open(
      `https://deeplink.keplr.app/web-browser?url=${window.origin}`,
      "_blank"
    );
  };

  const openKeplrShowAddress = () => {
    window.open(
      "https://deeplink.keplr.app/show-address?chainId=osmosis-1",
      "_blank"
    );
  };

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>Open Keplr Mobile via Deeplink</h2>
      <div className="item-container">
        <div className="item">
          <div className="item-title">Open Keplr Mobile</div>
          <div className="item-content">
            <button className="keplr-button" onClick={openKeplrMobile}>
              Open Keplr Mobile
            </button>
          </div>
        </div>

        <div className="item">
          <div className="item-title">web-browser</div>
          <div className="item-content">
            <button className="keplr-button" onClick={openKeplrInAppBrowser}>
              Open Keplr in App Browser
            </button>
          </div>
        </div>

        <div className="item">
          <div className="item-title">show-address</div>
          <div className="item-content">
            <button className="keplr-button" onClick={openKeplrShowAddress}>
              Osmosis
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
