# Neural Research Sentinel UI/UX Upgrade - TODO

## Step 1: Theme foundation
- Add light/dark mode via CSS variables and a toggle component.
- Update Tailwind theme/colors and `index.css` to support both themes.

## Step 2: Premium landing + AI lab visuals
- Replace current App layout with a premium landing section:
  - Hero with animated AI graphics
  - Floating neural particles background
  - Animated research scanning sequence
  - CTA buttons and feature cards
  - Testimonials + Pricing sections

## Step 3: NASA-like live dashboard widgets
- Add dashboard widgets that show:
  - Animated stats counters
  - Research analytics panels (glass + neon)
  - Smooth microinteractions

## Step 4: Integrate real-time prediction flow
- Keep existing OpenAI-backed scan flow unchanged:
  - `/api/upload` then `/api/analyze`
  - Render real results into existing panels (UploadZone, IntegrityGauge, PremiumFeatures, RecentScans).

## Step 5: Polish + accessibility
- Smooth transitions, consistent spacing, responsive layout.
- Ensure reduced-motion support.

## Step 6: Run & verify
- Run frontend (`npm run dev`) and backend (`backend/main.py` or docker compose / bat script) as needed.
- Verify smooth UI, theme toggle, and successful real scans.

