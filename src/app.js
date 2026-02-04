const { useMemo, useState } = React;

const rightPlanets = [
  { name: "Earth", className: "earth", level: 1 },
  { name: "Mars", className: "mars", level: 5 },
  { name: "Jupiter", className: "jupiter", level: 12 },
  { name: "Saturn", className: "saturn", level: 20 },
  { name: "Uranus", className: "uranus", level: 28 },
  { name: "Neptune", className: "neptune", level: 36 },
  { name: "Pluto", className: "pluto", level: 45 },
];

const leftPlanets = [
  { name: "Venus", className: "venus", level: 3 },
  { name: "Mercury", className: "mercury", level: 2 },
  { name: "Sun", className: "sun", level: 0 },
];

const universes = [
  "Milky Way",
  "Andromeda",
  "Triangulum",
  "Sombrero",
  "Cartwheel",
  "Nebula Nexus",
  "Quantum Deep",
  "Mythic Arc",
  "Infinity Loop",
];

const upgrades = [
  {
    name: "Hyper Tap",
    description: "+1 energy per tap",
    cost: 25,
  },
  {
    name: "Solar Forge",
    description: "+2 energy per tap",
    cost: 60,
  },
  {
    name: "Planetary Drones",
    description: "+5 passive income",
    cost: 140,
  },
];

const inventoryItems = [
  { name: "Cosmic Ore", amount: 320, tag: "resource" },
  { name: "Stardust", amount: 98, tag: "material" },
  { name: "Warp Cells", amount: 14, tag: "power" },
];

function App() {
  const [energy, setEnergy] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(120);
  const [money, setMoney] = useState(75);
  const [crystals, setCrystals] = useState(12);
  const [tokens, setTokens] = useState(3);
  const [universeIndex, setUniverseIndex] = useState(0);

  const unlockedPlanets = useMemo(() => {
    return rightPlanets.filter((planet) => level >= planet.level);
  }, [level]);

  const handleTap = () => {
    setEnergy((prev) => prev + 3);
    setCoins((prev) => prev + 1);
    if ((energy + 3) % 30 === 0) {
      setLevel((prev) => prev + 1);
    }
  };

  const handleUpgrade = (upgrade) => {
    if (coins < upgrade.cost) {
      return;
    }
    setCoins((prev) => prev - upgrade.cost);
    setMoney((prev) => prev + 10);
    setCrystals((prev) => prev + 2);
    setTokens((prev) => prev + 1);
  };

  const handleUniverseJump = () => {
    setUniverseIndex((prev) => (prev + 1) % universes.length);
    setLevel((prev) => prev + 3);
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="brand">
          <h1>SpaceClicker</h1>
          <span>Version 1.0.0 · Infinite Universe Idle Experience</span>
        </div>
        <div className="status-panel">
          <div className="player-card">
            <div className="player-avatar">SC</div>
            <div>
              <div>Commander Nova</div>
              <span className="badge">Level {level}</span>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <h4>Energy</h4>
              <p>{energy.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h4>Coins</h4>
              <p>{coins.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h4>Money</h4>
              <p>${money.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h4>Crystals</h4>
              <p>{crystals.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h4>Planet Tokens</h4>
              <p>{tokens.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="main-grid">
        <div className="panel">
          <h2>Marketplace</h2>
          <div className="list">
            {upgrades.map((upgrade) => (
              <div className="list-item" key={upgrade.name}>
                <div>
                  <strong>{upgrade.name}</strong>
                  <span>{upgrade.description}</span>
                </div>
                <button
                  className="button"
                  onClick={() => handleUpgrade(upgrade)}
                >
                  Buy · {upgrade.cost}c
                </button>
              </div>
            ))}
          </div>
          <div className="panel">
            <h2>Inventory</h2>
            <div className="list">
              {inventoryItems.map((item) => (
                <div className="list-item" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.tag}</span>
                  </div>
                  <div className="badge">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="galaxy-stage">
          <div className="clicker-core" onClick={handleTap}>
            <div className="core-label">
              Tap the Star<br />
              +3 Energy
            </div>
          </div>
          <div className="orbits">
            <div className="orbit-row">
              <div className="orbit-pill">
                {leftPlanets.map((planet) => (
                  <div
                    key={planet.name}
                    className={`planet ${planet.className}`}
                    title={`${planet.name} · Lv ${planet.level}`}
                  />
                ))}
                <span>{leftPlanets.map((planet) => planet.name).join(" · ")}</span>
              </div>
            </div>
            <div className="orbit-row">
              <div className="orbit-pill">
                {rightPlanets.map((planet) => (
                  <div
                    key={planet.name}
                    className={`planet ${planet.className}`}
                    style={{ opacity: level >= planet.level ? 1 : 0.3 }}
                    title={`${planet.name} · Unlock Lv ${planet.level}`}
                  />
                ))}
                <span>
                  {rightPlanets.map((planet) => planet.name).join(" · ")}
                </span>
              </div>
            </div>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={handleUniverseJump}>
              Jump Universe
            </button>
            <button className="button ghost">Auto-Drone</button>
            <button className="button ghost">Ship Boost</button>
          </div>
        </div>

        <div className="panel">
          <h2>Galaxy Progress</h2>
          <div className="list">
            <div className="list-item">
              <div>
                <strong>Unlocked Planets</strong>
                <span>Right-side orbit lane</span>
              </div>
              <div className="badge">{unlockedPlanets.length}</div>
            </div>
            <div className="list-item">
              <div>
                <strong>Current Universe</strong>
                <span>{universes[universeIndex]}</span>
              </div>
              <div className="badge">Active</div>
            </div>
          </div>
          <div className="universe-track">
            {universes.map((universe, index) => (
              <div className="universe-item" key={universe}>
                <div>
                  <strong>{universe}</strong>
                  <span>{index <= universeIndex ? "Unlocked" : "Locked"}</span>
                </div>
                <div className="badge">
                  {index === universeIndex ? "Now" : `Tier ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
          <div className="panel">
            <h2>Settings</h2>
            <div className="list">
              <div className="list-item">
                <div>
                  <strong>Sound FX</strong>
                  <span>Arcade neon pulses</span>
                </div>
                <div className="badge">On</div>
              </div>
              <div className="list-item">
                <div>
                  <strong>Controller Support</strong>
                  <span>Touch + keyboard + controller</span>
                </div>
                <div className="badge">Enabled</div>
              </div>
              <div className="list-item">
                <div>
                  <strong>Accessibility</strong>
                  <span>High contrast & vibration</span>
                </div>
                <div className="badge">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-bar">
        <div>
          <strong>Galaxy Clicker</strong> · Tap, upgrade, and unlock infinite
          universes.
        </div>
        <div className="menu">
          <button className="button ghost">Main Menu</button>
          <button className="button ghost">Leaderboard</button>
          <button className="button ghost">Support</button>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
