const { useMemo, useState, useEffect, useCallback } = React;

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
    description: "+1 tap power",
    cost: 25,
    effect: { tap: 1 },
  },
  {
    name: "Solar Forge",
    description: "+2 tap power",
    cost: 60,
    effect: { tap: 2 },
  },
  {
    name: "Planetary Drones",
    description: "+5 passive energy",
    cost: 140,
    effect: { passive: 5 },
  },
  {
    name: "Nebula Market",
    description: "+2 passive coins",
    cost: 220,
    effect: { coins: 2 },
  },
];

const inventoryItems = [
  { name: "Cosmic Ore", amount: 320, tag: "resource" },
  { name: "Stardust", amount: 98, tag: "material" },
  { name: "Warp Cells", amount: 14, tag: "power" },
  { name: "Quantum Keys", amount: 4, tag: "unlock" },
];

function PlanetLane({ planets, label, lockLevel }) {
  return (
    <div className="orbit-pill">
      <div className="orbit-dots">
        {planets.map((planet) => (
          <div
            key={planet.name}
            className={`planet ${planet.className}`}
            style={{ opacity: lockLevel >= planet.level ? 1 : 0.3 }}
            title={`${planet.name} · Unlock Lv ${planet.level}`}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <p>{value}</p>
    </div>
  );
}

function App() {
  const [energy, setEnergy] = useState(0);
  const [coins, setCoins] = useState(120);
  const [money, setMoney] = useState(75);
  const [crystals, setCrystals] = useState(12);
  const [tokens, setTokens] = useState(3);
  const [universeIndex, setUniverseIndex] = useState(0);
  const [upgradeState, setUpgradeState] = useState({});

  const level = useMemo(() => Math.floor(energy / 30) + 1, [energy]);

  const tapPower = useMemo(() => {
    return (
      3 +
      upgrades.reduce((total, upgrade) => {
        const count = upgradeState[upgrade.name] || 0;
        return total + (upgrade.effect.tap || 0) * count;
      }, 0)
    );
  }, [upgradeState]);

  const passiveEnergy = useMemo(() => {
    return upgrades.reduce((total, upgrade) => {
      const count = upgradeState[upgrade.name] || 0;
      return total + (upgrade.effect.passive || 0) * count;
    }, 1);
  }, [upgradeState]);

  const passiveCoins = useMemo(() => {
    return upgrades.reduce((total, upgrade) => {
      const count = upgradeState[upgrade.name] || 0;
      return total + (upgrade.effect.coins || 0) * count;
    }, 0);
  }, [upgradeState]);

  const unlockedPlanets = useMemo(() => {
    return rightPlanets.filter((planet) => level >= planet.level);
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => prev + passiveEnergy);
      setCoins((prev) => prev + passiveCoins);
    }, 1000);
    return () => clearInterval(timer);
  }, [passiveEnergy, passiveCoins]);

  const handleTap = useCallback(() => {
    setEnergy((prev) => prev + tapPower);
    setCoins((prev) => prev + 1);
  }, [tapPower]);

  const handleUpgrade = (upgrade) => {
    if (coins < upgrade.cost) {
      return;
    }
    setCoins((prev) => prev - upgrade.cost);
    setMoney((prev) => prev + 10);
    setCrystals((prev) => prev + 2);
    setTokens((prev) => prev + 1);
    setUpgradeState((prev) => ({
      ...prev,
      [upgrade.name]: (prev[upgrade.name] || 0) + 1,
    }));
  };

  const handleUniverseJump = useCallback(() => {
    setUniverseIndex((prev) => (prev + 1) % universes.length);
    setEnergy((prev) => prev + 45);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.repeat) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        handleTap();
      }
      if (event.code === "Enter") {
        handleUniverseJump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleTap, handleUniverseJump]);

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
            <StatCard label="Energy" value={energy.toLocaleString()} />
            <StatCard label="Coins" value={coins.toLocaleString()} />
            <StatCard label="Money" value={`$${money.toLocaleString()}`} />
            <StatCard label="Crystals" value={crystals.toLocaleString()} />
            <StatCard label="Planet Tokens" value={tokens.toLocaleString()} />
            <StatCard label="Tap Power" value={`+${tapPower}`} />
            <StatCard label="Energy / sec" value={`+${passiveEnergy}`} />
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
                  disabled={coins < upgrade.cost}
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
          <div className="panel">
            <h2>Controls</h2>
            <div className="list">
              <div className="list-item">
                <div>
                  <strong>Touch / Click</strong>
                  <span>Tap the star to earn energy</span>
                </div>
                <div className="badge">Primary</div>
              </div>
              <div className="list-item">
                <div>
                  <strong>Keyboard</strong>
                  <span>Space to tap, Enter to jump</span>
                </div>
                <div className="badge">Mapped</div>
              </div>
              <div className="list-item">
                <div>
                  <strong>Controller</strong>
                  <span>Right trigger to tap, A to jump</span>
                </div>
                <div className="badge">Ready</div>
              </div>
            </div>
          </div>
        </div>

        <div className="galaxy-stage">
          <div className="clicker-core" onPointerDown={handleTap}>
            <div className="core-label">
              Tap the Star<br />
              +{tapPower} Energy
            </div>
          </div>
          <div className="orbits">
            <div className="orbit-row">
              <PlanetLane
                planets={leftPlanets}
                label="Venus · Mercury · Sun"
                lockLevel={level}
              />
            </div>
            <div className="orbit-row">
              <PlanetLane
                planets={rightPlanets}
                label="Earth · Mars · Jupiter · Saturn · Uranus · Neptune · Pluto"
                lockLevel={level}
              />
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
            <div className="list-item">
              <div>
                <strong>Infinity Status</strong>
                <span>Looped universe tiers</span>
              </div>
              <div className="badge">∞</div>
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
              <div className="list-item">
                <div>
                  <strong>Main Menu</strong>
                  <span>Profile, save slots, themes</span>
                </div>
                <div className="badge">Open</div>
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
