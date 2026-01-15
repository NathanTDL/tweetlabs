# TweetLab – Product Specification

## Overview

TweetLab is a **Twitter/X content simulation and experimentation lab**.

It allows creators to **stress‑test tweets before posting** by simulating how X *might* react — visually, emotionally, and structurally — using AI.

TweetLab is **not a prediction oracle**. It is a **flight simulator for attention**.

The product is free, fast, visual, and designed to be screenshot‑worthy.

---

## Core Value Proposition

> "Test your tweet before the internet does."

TweetLab helps users:

* Understand *why* a tweet might work or flop
* See simulated engagement in a realistic X UI
* Get higher‑virality alternatives instantly
* Learn patterns of attention without risking their account

---

## Target Users

Primary:

* Indie hackers
* Builders
* Solo founders
* Content creators on X

Secondary:

* Growth marketers
* Startup founders
* Personal brand builders

---

## MVP Scope (48‑Hour Build)

### What TweetLab DOES

* Simulates engagement for **one tweet at a time**
* Visually renders a **fake but realistic X post**
* Animates likes, replies, reposts, quotes
* Generates AI replies over time
* Provides actionable feedback + rewrites

### What TweetLab DOES NOT DO (for MVP)

* No real engagement prediction guarantees
* No follower graph modeling
* No threads
* No auth / accounts
* No history saving

---

## Core User Flow

1. User lands on homepage
2. Sees "Paste your tweet" input
3. Clicks **Run Simulation**
4. Loading state ("Running simulation...")
5. Simulation view loads
6. Engagement animates in real time
7. AI replies appear gradually
8. Analysis + alternatives shown on the right

---

## UI Layout

TweetLab intentionally mirrors the **native X (Twitter) timeline experience** to maximize familiarity, realism, and screenshot virality.

The UI is split into **three zones**:

1. Top Composer ("What’s happening?")
2. Main Timeline (AI‑simulated tweets & reactions)
3. Right Sidebar (Refined / Higher‑Virality Alternatives)

---

### 1. Top Composer – X‑Style Entry Point

At the very top of the page, users see a **pixel‑accurate X‑style composer**:

* Profile avatar (generic / placeholder)
* Input placeholder: **“What’s happening?”**
* Character counter
* Disabled media icons (icons visible, non‑functional for MVP)
* Primary CTA: **Post**

Behavior:

* User writes a tweet
* Clicks **Post**
* Composer clears
* Tweet immediately appears at the top of the timeline below

This creates the illusion of posting to X, while remaining fully simulated.

---

### 2. Main Timeline – AI‑Simulated Feed

The center column behaves like a real X feed.

#### Tweet Card

Each tweet card contains:

* Avatar
* Display name (@you)
* Timestamp ("just now")
* Tweet content

Below the tweet:

* ❤️ Likes
* 🔁 Reposts
* 💬 Replies
* 🔖 Quotes

#### AI Reaction Simulation

* Engagement counts animate upward over time
* Growth uses randomized jitter for realism
* Counts stabilize after ~10–15 seconds
* Numbers are pre‑computed, only animation is client‑side

#### AI Replies

* AI‑generated replies appear **inline**, one by one
* 5–10 replies max
* Replies feel human:

  * Agreement
  * Skepticism
  * Questions
  * Mild criticism

Replies are revealed on a timer to simulate organic interaction.

---

### 3. Right Sidebar – Refined Tweets Panel

The right sidebar is where **real value and learning happens**.

It updates instantly after posting.

#### Sections

**Engagement Outlook**

* Low / Medium / High
* Short explanation (2–3 lines)

**Why This Performs This Way**

* Hook strength
* Clarity
* Emotional trigger
* Novelty
* Authority signal

**Refined Alternatives**

3 rewritten tweets optimized for:

1. Curiosity
2. Authority
3. Controversy

Each alternative includes:

* One‑sentence reasoning
* One‑click copy button

---

### AI Replies Feed

* 5–10 replies max
* Generated upfront, revealed over time
* Mix of:

  * Praise
  * Criticism
  * Neutral comments
  * Questions

Tone should feel human and varied.

---

### Right Panel – Analysis & Optimization

#### 1. Engagement Outlook

* Low / Medium / High range
* Short explanation (2–3 lines)

Example:

> "This tweet has a strong hook but lacks specificity, limiting repost potential."

---

#### 2. Why It Works / Why It Fails

Bulleted insights such as:

* Hook strength
* Clarity
* Novelty
* Authority signal
* Emotional trigger

---

#### 3. Rewrite Suggestions

* 3 alternative tweets
* Each optimized for:

  * Curiosity
  * Authority
  * Controversy

Each rewrite includes a short reason why it performs better.

---

## AI Chat on the left side to make the platform balanced

Simple input:

* "Make it shorter"
* "Make it more controversial"
* "Rewrite for builders"

Each chat interaction = **new request** (no memory) and short.

---

## AI Behavior & Prompting Principles

* One‑shot generation per simulation
* Output structured JSON internally
* Never claim certainty
* Use language like:

  * "likely"
  * "tends to"
  * "often performs"

---


## Technical Stack (Suggested)

* Frontend: Next.js
* Styling: Tailwind
* Backend: Serverless functions
* AI: Gemini
* State: Client‑side animation

---

## Rate Limiting

* 3 simulations per IP per hour
* Soft block with friendly message
