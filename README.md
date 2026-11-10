# FLIPX — Ultimate Edition

A polished, responsive coin-flip website built with HTML, CSS and vanilla JavaScript.

## Run it
1. Extract `FLIPX-ULTIMATE.zip`.
2. Open the `FLIPX` folder.
3. Double-click `index.html` to open in your browser.
4. For development, open the folder in VS Code and use Live Server.

## Included
- Animated 3D coin with gold, silver, copper and neon finishes
- Ambient background glow, orbit rings, floating coin, button shine, hover states and reveal animations
- Sound toggle (Web Audio generated effects)
- Toss history, heads/tails counts, percentages, win rate and streak
- Daily 10-flip challenge
- Dark/light mode
- Local leaderboard
- Pass-and-play two-player mode
- Keyboard shortcuts: Space = flip, H = heads, T = tails, M = theme, S = sound
- Mobile-responsive layout and reduced-motion accessibility support
- LocalStorage persistence

## Notes
- Local stats/history/settings are stored in the current browser only.
- The leaderboard is local to this device. A shared online leaderboard requires a backend/database and user accounts.
- Two-player mode is pass-and-play on one device.
- `Math.random()` is suitable for a casual coin-flip game, not for security-sensitive randomness.
- Google Fonts require internet access; fallback fonts are provided.

## Publish
Push the files to a GitHub repository and import it into Vercel. After deployment, add the public URL to Google Search Console and request indexing. Google decides when/if it indexes the site.
