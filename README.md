# @clawsxcece — Custom Nail Studio Lead Engine & Compliant Outreach Pipeline

A Next.js dashboard designed for independent nail artists to capture incoming prospects, manage booking leads, and streamline personalized outreach—without violating any of Instagram's anti-spam rules :3

---

## Key Features

- **Lead Queue Management:** Tracks incoming prospects, style preferences (Gel-X, Builder Gel/Natural Nail, Junk Nails, Simple), and pipeline status (`New`, `Contacted`, `Booked`).
- **AI-Powered Draft Generator:** Generates cute, personalized outreach messages tailored to users who interact with Reels, stories and posts!
- **Compliant One-Click Routing:** Utilizes `ig.me` direct deep links to open pre-filled messages

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** Instagram Direct Deep Links (`https://ig.me/m/`)

---

## How It Works

1. **Inbound Capture:** Potential customers interacting with content (likes, comments, story tags) are logged in the **Leads Queue**.
2. **Drafting:** Selecting **Draft DM** calls the backend route (`/api/generate-outreach`) to craft a personalized message.
3. **Dispatch:** Clicking **Open IG & Send DM** launches the official Instagram app with the pre-filled message ready to send.
