import { useState } from 'react'
import { Backlink, Section, Challenge, CaseNav } from '../../components/case/CaseParts'

function PluginCard({ name, kind, tag, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`plugin-card${open ? ' open' : ''}`}>
      <button className="plugins-toggle" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="plugin-name">{name}</span>
        <span className="plugin-kind">{kind}</span>
        <span className="plugin-tag">{tag}</span>
        <span className="chev">&#9662;</span>
      </button>
      <div className="plugins-collapse"><div className="plugins-inner">
        {children}
      </div></div>
    </div>
  )
}

export default function Minecraft() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <span className="mc-row">
              <img src="/assets/logos/mc-tnt.webp" alt="Blitz Raids TNT" />
              <img src="/assets/logos/mc-blitz-bolt.png" alt="Blitz bolt" />
              <img className="mc-swap-dark" src="/assets/logos/mc-atlas-a.png" alt="A server mark" />
              <img className="mc-swap-dark" src="/assets/logos/mc-apollo-meteor.png" alt="Apollo Realms" />
              <img src="/assets/logos/mc-riverside.png" alt="Riverside" />
            </span>
          </span>
          <span className="case-kicker">Game Servers · where it started</span>
          <div className="case-status">
            <span className="st">self-taught</span>
          </div>
          <h1 className="case-title">Server development</h1>
          <p className="case-summary">Before apps and products, I spent years running large multiplayer Minecraft servers &mdash; building the plugins, designing the economies, managing the infrastructure, handling payments, and keeping real communities alive. Looking back, it was my first startup, and most of the product and engineering instincts I use now started here.</p>
          <p className="case-tags">Java · Game systems · Economy design · Community management</p>
        </div>

        <Section num="01" title="The start">
          <p>Running a server that people actually want to play on means building the systems that keep them there. Off-the-shelf plugins only get you so far &mdash; the moment you want a custom economy, your own minigames, and monetization that doesn&rsquo;t feel cheap, you&rsquo;re writing software. That&rsquo;s how I started writing software.</p>
        </Section>

        <Section num="02" title="Servers I worked on">
          <p className="subsec-intro">Most recent first. Across these servers I handled the full operator stack &mdash; economy and shops, ranks and permissions, moderation and anti-grief, gameplay systems, monetization, and infrastructure &mdash; and when off-the-shelf plugins ran out, I wrote my own.</p>
          <div className="server-list">
            <div className="server-row">
              <div className="server-logo"><img src="/assets/logos/mc-blitz-bolt.png" alt="Blitz Raids" /></div>
              <div className="server-info">
                <div className="server-top"><h3>Blitz Raids</h3><span className="st">unreleased</span></div>
                <p>My most ambitious project &mdash; a heavily custom-built Factions experience. Most of my custom plugins (including Jackpot and BlitzEnchants) and most of the code I&rsquo;ve written for Minecraft live here. I built a community and testing group of 50+ people, but development paused before release due to things going on in my life. I still plan to go back to it.</p>
              </div>
            </div>
            <div className="server-row">
              <div className="server-logo"><img src="/assets/logos/mc-atlas-a.png" alt="Avalon" /></div>
              <div className="server-info">
                <div className="server-top"><h3>Avalon</h3><span className="st">since 2016</span></div>
                <p>A community my friend and I started in 2016, spanning Skyblock, Prison, and more. At its peak, around <b>300 players online at once</b>.</p>
              </div>
            </div>
            <div className="server-row">
              <div className="server-logo"><img className="mc-swap-dark" src="/assets/logos/mc-apollo-meteor.png" alt="Apollo Realms" /></div>
              <div className="server-info">
                <div className="server-top"><h3>Apollo Realms</h3><span className="st">age ~12</span></div>
                <p>A Factions server I made when I was around 12, peaking at about 50 concurrent players.</p>
              </div>
            </div>
            <div className="server-row">
              <div className="server-logo"><img src="/assets/logos/mc-tnt.webp" alt="Infinite Raids" /><img src="/assets/logos/mc-riverside.png" alt="Riverside" /></div>
              <div className="server-info">
                <div className="server-top"><h3>Infinite Raids &amp; Riverside</h3><span className="st">age 10&ndash;11</span></div>
                <p>Smaller servers I made when I was around 10&ndash;11 &mdash; where all of this started.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section num="03" title="Plugins I built">
          <p className="subsec-intro">Custom Java plugins I wrote for these servers. A few are public on GitHub &mdash; expand any to see what it does and how it&rsquo;s built.</p>
          <div className="plugin-list">
            <PluginCard name="Jackpot" kind="Plugin" tag={<>Milestone jackpot &middot; Vault &middot; BossBar</>}>
              <p className="plugin-desc">A milestone-based jackpot system. Players contribute currency to a global pool; as it crosses configurable thresholds, tiered milestone rewards fire via server commands, with progress shown live on a boss bar. After the final milestone, an &ldquo;End&rdquo; phase counts down on its own bar before running a last set of commands.</p>
              <div className="plugin-lbl">What it does</div>
              <ul className="dot">
                <li>Global jackpot players contribute to, validated and deducted through Vault.</li>
                <li>Tiered milestones, each with its own title, reward, and boss-bar color.</li>
                <li>Real-time BossBar progress with color-coded titles and percentage fill.</li>
                <li>&ldquo;The End&rdquo; final countdown phase with its own depleting bar and commands.</li>
                <li>Custom <code>%jackpot_*%</code> placeholders for scoreboards via PlaceholderAPI.</li>
              </ul>
              <div className="plugin-lbl">Built with</div>
              <p className="plugin-chips"><span>Java OOP</span><span>Bukkit BossBar API</span><span>BukkitRunnable</span><span>Vault economy</span><span>YAML config</span><span>PlaceholderAPI</span></p>
              <a className="plugin-link" href="https://github.com/userN7590/Jackpot" target="_blank" rel="noopener">View on GitHub &rarr;</a>
            </PluginCard>

            <PluginCard name="BlitzEnchants" kind="Plugin" tag={<>Rune-based enchantments &middot; custom GUI</>}>
              <p className="plugin-desc">A rune-based custom enchantment system built for the Blitz Raids server. Players fuse five runes of equal rarity to forge enchantments, managed through a dynamic inventory GUI, with each rune&rsquo;s data stored on the item itself.</p>
              <div className="plugin-lbl">What it does</div>
              <ul className="dot">
                <li>Rune fusion &mdash; combine five runes of equal rarity to forge an enchantment.</li>
                <li>Tiered enchantments across Basic, Advanced, and Legendary rarities.</li>
                <li>Fully dynamic 6-row GUI handling slot states and crafting logic.</li>
                <li>Rune metadata stored per-item via PersistentDataContainer.</li>
                <li>Async, thread-safe config loading and rune validation to avoid main-thread lag.</li>
              </ul>
              <div className="plugin-lbl">In game</div>
              <div className="plugin-shots">
                <figure>
                  <img src="/assets/projects/blitz-runecrafting.png" alt="BlitzEnchants rune crafting menu" />
                  <figcaption>The rune crafting GUI &mdash; fuse same-rarity runes to forge an enchantment.</figcaption>
                </figure>
                {/* Shows automatically once blitz-sword-lore.png is added to public/assets/projects/;
                    hidden until then so no broken image appears. */}
                <figure>
                  <img
                    src="/assets/projects/blitz-sword-lore.png"
                    alt="Enchanted Diamond Sword with BlitzEnchants lore"
                    onError={(e) => { e.currentTarget.closest('figure').style.display = 'none' }}
                  />
                  <figcaption>Custom enchantment &amp; charm lore on a forged Diamond Sword.</figcaption>
                </figure>
              </div>
              <div className="plugin-lbl">Built with</div>
              <p className="plugin-chips"><span>Java OOP</span><span>Enums</span><span>Interfaces</span><span>PersistentDataContainer</span><span>Inventory API</span><span>Async tasks</span><span>YAML config</span></p>
              <a className="plugin-link" href="https://github.com/userN7590/BlitzEnchants" target="_blank" rel="noopener">View on GitHub &rarr;</a>
            </PluginCard>

            <PluginCard name="SmartSpawnerNoEXP" kind="Fork" tag={<>SmartSpawner mod &middot; v1.4.0.2</>}>
              <p className="plugin-desc">A small fork of the SmartSpawner plugin that strips out its XP features while leaving everything else intact &mdash; the kind of targeted change running a real server constantly calls for.</p>
              <div className="plugin-lbl">What it changes</div>
              <ul className="dot">
                <li>Disables spawner XP generation and collection.</li>
                <li>Removes XP storage and display from holograms.</li>
                <li>Keeps loot generation, selling, and the GUI fully intact.</li>
              </ul>
              <a className="plugin-link" href="https://github.com/userN7590/SmartSpawnerNoEXP" target="_blank" rel="noopener">View on GitHub &rarr;</a>
            </PluginCard>
          </div>
        </Section>

        <Section num="04" title="Challenges & decisions">
          <Challenge n="01" q="Balancing an economy in public">
            <p>Every system had to be balanced, and any mistake showed up immediately in how players behaved. Tuning currency sinks and rewards so the economy didn&rsquo;t inflate or stall was a constant, very visible feedback loop.</p>
          </Challenge>
          <Challenge n="02" q="Monetizing without pay-to-win">
            <p>The server had to make money to stay online, but selling power kills a community. Designing cosmetics and perks that paid the bills without breaking fairness was a real product decision.</p>
          </Challenge>
          <Challenge n="03" q="Keeping it stable and safe">
            <p>Moderation, logging, and anti-grief tooling were what let a community actually grow instead of getting torn down by a few bad actors.</p>
          </Challenge>
        </Section>

        <Section num="05" title="Results">
          <p>The real outcome was a server with live systems and a community of actual players whose engagement &mdash; and whose drop-off &mdash; reflected every decision I made. Retention was the scoreboard: every update either kept people playing or it didn&rsquo;t, and there was nowhere to hide from that.</p>
        </Section>

        <Section num="06" title="Lessons learned">
          <ul className="dot">
            <li>Ship, watch real users react, adjust &mdash; the loop I still run on started here.</li>
            <li>Economy and incentive design are product work, not just code.</li>
            <li>A community is a system too; the technical and the human sides aren&rsquo;t separable.</li>
          </ul>
        </Section>

        <CaseNav
          prev={{ to: '/projects/aire', lbl: 'Previous', label: <>&larr; AIRE</> }}
          next={{ to: '/projects', lbl: 'Back to', label: <>All projects &rarr;</> }}
        />
      </article>
    </>
  )
}
