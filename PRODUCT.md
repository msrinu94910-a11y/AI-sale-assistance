# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, CSS, HTML5, Python FastAPI, SQLite

## Users

**1. Website Visitors:** Casual home buyers or investors looking to explore properties, compare options (e.g. 3 BHK vs Villa), check budgets, and book site visits.
**2. Sales Team:** Receives structured lead data (name, contact, budget, preferences) and booked site-visit appointments.

## Product Purpose

A digital conversational sales representative that converts casual website visitors into qualified property leads through natural-language conversation, property discovery, and site-visit scheduling.

## Positioning

An AI assistant that strictly adheres to the application's real database instead of hallucinating properties (No RAG). It acts as a helpful, always-available sales agent that bridges the gap between static forms and human sales reps.

## Operating Context

Embedded as a chat widget on a real estate website. Users interact with it while browsing properties or when they need help finding something specific (e.g., "Show properties below 1 crore in Gachibowli").

## Capabilities and Constraints

- **Capabilities:** Natural language understanding, automated BANT qualification, database-backed property search, live calendar booking, structured entity extraction.
- **Constraints:** Cannot invent/hallucinate property records; no RAG; no autonomous negotiation; no financial/legal advice. Must rely on the backend database for ground truth.

## Brand Commitments

Professional, trustworthy, and helpful real-estate sales representative persona.

## Evidence on Hand

- SQLite database containing verified properties (Villas, Apartments, Plots in locations like Gachibowli, Kondapur).
- Defined lead statuses (New, Contacted, Qualified, Proposal).

## Product Principles

1. **Database Truth Over Generative Freedom:** Never invent a property or price; always rely on backend data.
2. **Conversation as a Funnel:** Every chat turn should gently guide the user toward qualification or a site visit.
3. **Structured Handoff:** Ensure the sales team receives perfectly formatted, actionable lead data.
4. **Immediate Responsiveness:** Provide quick, relevant property recommendations without overwhelming the user.
