# Tugende Driver Partner Feature 🚀

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-blue)](https://driver-partner.vercel.app)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Problem Statement](#problem-statement)  
4. [Architecture & Tech Stack](#architecture--tech-stack)  
5. [Getting Started](#getting-started)  
   - Prerequisites  
   - Install & Run Locally  
6. [Usage & Flow](#usage--flow)  
7. [Future Enhancements](#future-enhancements)  
8. [Contribution](#contribution)  
9. [License](#license)  
10. [Contact](#contact)  

---

## Overview

**Tugende Driver Partner Feature** is a web-based prototype built to enhance the **Tugende Boda** app experience by offering new value to riders beyond loans. This project aims to:

- Empower riders with **gig/job opportunities**  
- Provide **trusted fuel & garage offers**  
- Introduce **Tupoints loyalty system**  
- Enable a **Bike Exchange/Upgrade** program  
- Transform the relationship from a loan-only system to a **partner ecosystem**  

You can try the live version here:  
👉 [Vercel Demo](https://driver-partner.vercel.app)

---

## Features

- **Driver Partner Unlock** — After a rider makes their first on-time repayment, new features unlock.  
- **Gig/Job Listings** — Riders can see and apply for gigs directly in the app.  
- **Fuel & Garage Offers** — Access to vetted offers for keeping bikes on the road.  
- **Tupoints Loyalty System** — Earn points and redeem them for fuel, services, or partial loan pay-down.  
- **Bike Exchange Program** — Trade in an existing Tugende bike and upgrade to a newer model with a fair top-up cost and terms.

---

## Problem Statement

Many riders faced a limited relationship:  
- They’d get a boda on loan, make repayments, and that was it.  
- They struggled to reliably find gigs and faced untrusted mechanics.  
- Beyond safety training, there were **few to no incentives or support systems** after obtaining the loan.

This project addresses that gap by turning Tugende from just a financier into a **true partner in the rider’s journey**.

---

## Architecture & Tech Stack

- **Framework:** Next.js (React-based)  
- **Styling:** Tailwind CSS  
- **Deployment:** Vercel  
- **Language & Types:** TypeScript  
- **Other Tools:** ESLint, PostCSS, etc.

The app is structured around pages/routes, components, services (API calls, business logic), and UI modules (offers, exchange, loyalty, etc.).

---

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)  
- npm or yarn  
- Git  

### Install & Run Locally

# Clone the repo
git clone https://github.com/Aber-Racheal/driver-partner.git

cd driver-partner

# Install dependencies
npm install
# or
yarn install

# Run in dev mode
npm run dev
# or
yarn dev
Once running, open http://localhost:3000 in your browser.

To build for production:
npm run build
npm run start
Usage & Flow
Landing / Dashboard — The rider can see their current status (unlocked vs locked).

Unlocking Driver Partner — After first repayment, the “Partner” section becomes available.

Offers Page — Contains listings for gigs, fuel/garage offers, and Exchange Offers.

Bike Exchange Flow

Show exchange listings

Value assessment (current bike vs top-up)

Application for exchange & new loan terms

Confirmation & scheduling

Redeem Tupoints — In the loyalty section, riders can redeem points for vouchers or loan discounts.

Screens and UI flows are simplified, focusing on core interactions.

Future Enhancements
Backend API & database integration (user, offers, transactions)

Authentication, user roles, and security layers

Real-time updates & pagination for gig/offer listings

Notifications (push/email) for new offers or reminders

Expanded exchange logic (grading bikes, inspection, logistics)

More robust error handling, validation, and edge-case coverage

Mobile responsiveness and optimized layouts

Analytics & dashboards for admin view

Contribution
Contributions are welcome! If you'd like to help:

Fork the repository

Create a feature branch (git checkout -b feature/YourFeature)

Make your changes & test

Commit with clear messages

Submit a Pull Request

Please stick to the existing code style and architecture.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
Created by [Racheal Aber]

GitHub: https://github.com/Aber-Racheal

Email: rachealaberr@gmail.com

Thank you for checking out this project! I welcome feedback, suggestions, or collaboration ideas.