# AI Sales Assistant — UI/UX Design Document

**Document Version:** 1.0  
**Status:** Draft / Assignment Baseline  
**Related Documents:** PRD.md, TRD.md, phases.md, architecture.md  
**Product:** AI-powered Website Sales Assistant  
**Design Goal:** Premium, modern, trustworthy, conversion-focused conversational experience  
**Primary UI:** Website chatbot  
**Frontend:** HTML5 + CSS3 + JavaScript  
**Responsive:** Desktop, tablet, mobile  
**Theme:** Premium Real Estate / Modern AI Assistant

---

# 1. Design Vision

The AI Sales Assistant should look and behave like a premium digital sales representative embedded inside a modern real-estate website.

The experience must communicate:

- Trust
- Simplicity
- Intelligence
- Speed
- Professionalism
- Conversion focus

The interface should prioritize conversation rather than a large form.

```text
Discover
   ↓
Conversation
   ↓
Requirement Capture
   ↓
Property Discovery
   ↓
Comparison
   ↓
Site Visit
```

---

# 2. Design Principles

## 2.1 Conversational First

The primary interaction should be natural language.

Instead of opening a large form:

```text
What type?
Budget?
Location?
BHK?
```

the assistant should progressively ask useful questions.

## 2.2 Minimal Friction

The customer should reach useful property results with as few interactions as possible.

## 2.3 Information Hierarchy

The interface should emphasize:

```text
Property → Price → Location → BHK → Key Details → Action
```

## 2.4 Trust Through Transparency

The assistant should clearly communicate when information comes from available property inventory.

Example:

> I found 4 properties matching your requirements.

## 2.5 Action-Oriented Design

Important actions should always be easy to reach:

```text
View Details
Compare
Book Site Visit
```

---

# 3. Visual Direction

The visual style should be **premium, clean, elegant, and modern** rather than overly playful.

Recommended visual language:

```text
Premium real-estate website
        +
Modern AI assistant
        +
Subtle glassmorphism
```

Glass effects should be used selectively, especially for the chatbot container, floating button, and secondary surfaces.

Avoid excessive gradients, excessive shadows, and overly decorative effects.

---

# 4. Color System

Use a restrained palette.

## 4.1 Primary

A deep premium neutral should be the main brand foundation.

Examples:

```text
#0F172A
#111827
```

## 4.2 Background

Use a soft neutral/light background for the website.

Examples:

```text
#F8FAFC
#F5F7FA
```

## 4.3 Accent

Use one premium accent for primary actions.

Example options:

```text
#C8A96B  — warm luxury gold
#2563EB  — professional blue
```

Only one primary accent should dominate the interface.

## 4.4 Semantic Colors

```text
Success → green
Warning → amber
Error   → red
Info    → blue
```

These should be reserved for status communication.

---

# 5. Typography

Recommended font families:

```text
Inter
Manrope
DM Sans
```

Use one primary family throughout the interface.

## Typography Hierarchy

```text
Page Heading      32–48px
Section Heading   24–32px
Card Heading      18–22px
Body              14–16px
Small Text        12–14px
```

The chatbot should prioritize readability over oversized typography.

---

# 6. Spacing System

Use a consistent spacing scale:

```text
4px
8px
12px
16px
24px
32px
48px
64px
```

Common rules:

```text
Chat message padding     12–16px
Card padding              16–20px
Section spacing            32–64px
Button horizontal padding 16–20px
```

---

# 7. Border Radius

Use moderately rounded components.

```text
Small controls     8px
Cards              12–16px
Chat window        18–24px
Floating button    50%
```

Avoid making every element extremely rounded.

---

# 8. Shadows and Depth

Use subtle depth.

Recommended:

- soft card shadow
- stronger shadow around chat window
- minimal shadow on buttons

Avoid heavy shadows that make the UI look outdated.

---

# 9. Website Chatbot Entry Point

The chatbot should appear as a floating button in the lower-right corner.

```text
                     Website
┌────────────────────────────────────────────┐
│                                            │
│             Website Content               │
│                                            │
│                                  ┌───────┐ │
│                                  │  AI   │ │
│                                  │ Chat  │ │
│                                  └───────┘ │
└────────────────────────────────────────────┘
```

## Floating Button

The button should:

- remain visible while scrolling
- have a clear AI/chat icon
- provide hover feedback
- open the assistant without navigation

Optional label:

```text
Ask AI
```

On small screens, use icon-only presentation.

---

# 10. Chat Window

Recommended desktop dimensions:

```text
Width: 380–440px
Height: 600–700px
```

Maximum height should not cover the entire desktop viewport.

On mobile:

```text
width: 100vw
height: 100vh
```

or use a near-fullscreen modal with safe-area spacing.

---

# 11. Chat Window Layout

```text
┌─────────────────────────────────────┐
│ AI Property Assistant          ●  × │
│ Find properties • Compare • Visit  │
├─────────────────────────────────────┤
│                                     │
│ AI message                          │
│                                     │
│                       User message  │
│                                     │
│ AI message + actions                │
│                                     │
│ [Find Property] [Under ₹1 Cr]      │
│                                     │
├─────────────────────────────────────┤
│ Type your message...          Send │
└─────────────────────────────────────┘
```

---

# 12. Chat Header

The header should contain:

```text
AI avatar/icon
Assistant name
Short capability description
Online/active state
Minimize/close action
```

Example:

```text
AI Property Assistant
Find the right property faster
● Online
```

The status indicator should not imply human availability.

---

# 13. AI Avatar

Use a simple AI/assistant icon rather than a realistic human face.

The avatar should be:

- recognizable
- small
- consistent
- visually aligned with the brand

Avoid cartoon characters unless the overall website brand requires them.

---

# 14. Message Design

## 14.1 User Message

User messages should align to the right.

```text
                         ┌──────────────────┐
                         │ I need a 3 BHK   │
                         │ under 1 crore.   │
                         └──────────────────┘
```

## 14.2 Assistant Message

Assistant messages align to the left.

```text
┌─────────────────────────────────┐
│ Great. Which location are you   │
│ considering?                    │
└─────────────────────────────────┘
```

Messages should have comfortable line height and enough spacing between turns.

---

# 15. Typing Indicator

When the AI is processing:

```text
● ● ●
```

or a subtle animated typing indicator should appear.

Copy examples:

```text
Thinking...
Searching properties...
Preparing your options...
```

Use state-specific text when a backend action is occurring.

---

# 16. Suggested Prompt Design

Suggested actions reduce the effort required for first-time users.

Primary prompts:

```text
[Find a Property]
[Under ₹1 Cr]
[Find a 3 BHK]
[Compare Properties]
[Book a Site Visit]
```

The list should remain compact.

After the user begins interacting, suggested prompts should become contextual.

Example:

```text
[Show Villas]
[Change Budget]
[Try Nearby Locations]
```

---

# 17. Requirement Collection UI

The assistant should primarily collect requirements through conversation.

However, when a structured value is easier to select, use compact controls.

Examples:

```text
Budget
[₹50L–₹75L] [₹75L–₹1Cr] [₹1Cr+]
```

```text
Property Type
[Apartment] [Villa] [Plot] [House]
```

These controls should supplement conversation, not replace it.

---

# 18. Requirement Summary

Once enough requirements are collected, display a compact summary.

Example:

```text
Your preferences
────────────────────────
Location     Hyderabad
Type         Villa
BHK          3
Budget       Up to ₹1 Cr

[Edit Preferences]
[Show Matches]
```

This provides confirmation before searching.

---

# 19. Property Result Cards

Property results are the most important visual component after the chat interface.

Recommended structure:

```text
┌──────────────────────────────────────┐
│              Property Image          │
│                                      │
│ Green Valley Villas          ★ Match │
│ Gachibowli                           │
│                                      │
│ 3 BHK • 1,650 sqft • ₹95 Lakh       │
│                                      │
│ Clubhouse • Gym • Pool              │
│                                      │
│ [View Details] [Compare]            │
│                       [Book Visit]   │
└──────────────────────────────────────┘
```

If property images are not available in the database, do not invent them. Use a neutral placeholder.

---

# 20. Property Match Indicator

Recommendations can display a simple match indicator.

Example:

```text
94% Match
```

or:

```text
Best Match
```

The score should only be shown if generated by a deterministic application rule.

Avoid implying that the score is an objective guarantee.

---

# 21. Property Details View

The customer should be able to open property details without losing the chat context.

Recommended sections:

```text
Property Name
Price
Location
Property Type
BHK
Area
Amenities
Description

[Compare]
[Book Site Visit]
```

On desktop, a side panel or modal can be used.

On mobile, use a full-screen detail view.

---

# 22. Comparison UI

Comparison should be visual and scannable.

```text
┌───────────────────────────────────────────────┐
│               Property Comparison             │
├─────────────────┬─────────────┬───────────────┤
│ Feature         │ Property A  │ Property B    │
├─────────────────┼─────────────┼───────────────┤
│ Price           │ ₹85 Lakh    │ ₹92 Lakh      │
│ Location        │ Gachibowli  │ Kondapur      │
│ BHK             │ 3           │ 3             │
│ Area            │ 1650 sqft   │ 1720 sqft     │
│ Status          │ Available   │ Available     │
└─────────────────┴─────────────┴───────────────┘
```

On mobile, comparison should become horizontally scrollable or transform into stacked comparison cards.

---

# 23. Comparison Summary

Below factual comparison data, show an AI-generated summary.

Example:

> Property A is more budget-friendly, while Property B offers a larger area.

This summary must use only verified comparison fields.

---

# 24. Site Visit Booking UX

The booking flow should feel conversational and simple.

```text
Select Property
      ↓
Choose Date
      ↓
Choose Time
      ↓
Enter Contact Details
      ↓
Review
      ↓
Confirm
```

Whenever possible, use native date/time controls instead of requiring free-form typing.

---

# 25. Booking Form

Recommended compact form:

```text
Book a Site Visit

Property
Green Valley Villas

Name
[________________]

Phone
[________________]

Email
[________________]

Date
[ DD / MM / YYYY ]

Time
[ 11:00 AM       ]

[Confirm Site Visit]
```

The form should prefill information already collected during chat.

---

# 26. Booking Confirmation

Use a high-confidence success state.

```text
┌────────────────────────────────────┐
│            ✓ Visit Requested        │
│                                    │
│ Green Valley Villas                │
│ 14 September 2026 • 11:00 AM      │
│                                    │
│ Reference                          │
│ SV-20260914-001                   │
│                                    │
│ [Done] [Continue Exploring]       │
└────────────────────────────────────┘
```

The reference must come from the backend.

---

# 27. Empty States

## No Matching Properties

```text
No exact matches found.

We can try a slightly higher budget or
another nearby location.

[Expand Budget]
[Try Nearby Locations]
```

## No Comparison Selected

```text
Select at least two properties to compare.
```

Empty states should always provide a next action.

---

# 28. Error States

Errors should be human-readable.

Example:

```text
Something went wrong while searching.
Please try again.

[Try Again]
```

Do not expose:

```text
Traceback
SQL errors
OpenAI errors
API keys
internal exception messages
```

---

# 29. Unknown Intent UX

When the assistant does not understand the request:

```text
I can help you find properties, compare options,
or book a site visit.

What would you like to do?

[Find Property]
[Compare]
[Book Visit]
```

The assistant should redirect rather than produce a random answer.

---

# 30. Mobile Design

Mobile should be treated as a first-class experience.

## Chat Window

```text
100% viewport width
100% viewport height
```

## Input

The message input should remain accessible near the bottom while accounting for the mobile keyboard.

## Cards

Property cards should stack vertically.

## Comparison

Use horizontal scrolling or stacked sections.

## Booking

Use full-width controls with comfortable touch targets.

Minimum recommended touch target:

```text
44 × 44px
```

---

# 31. Desktop Design

The chatbot should feel like a natural layer on top of the website, not a separate application.

Recommended:

```text
Floating button
      ↓
Fixed chat window
      ↓
Property cards inside conversation
      ↓
Modal/side panel for details
```

The main website remains visible behind the assistant.

---

# 32. Responsive Breakpoints

Suggested breakpoints:

```text
Mobile       < 640px
Tablet       640–1023px
Desktop      1024–1439px
Large Desktop ≥ 1440px
```

The exact breakpoints can be adjusted during implementation.

---

# 33. Accessibility

The chatbot should meet basic accessibility standards.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible button labels
- adequate contrast
- readable font size
- screen-reader-friendly status updates
- form labels
- error messages associated with fields

The close/minimize button must have an accessible label.

Example:

```html
<button aria-label="Close AI assistant">×</button>
```

---

# 34. Motion and Animation

Animation should be subtle.

Recommended:

- chat open/close transition
- typing indicator
- button hover state
- property card hover elevation
- success confirmation animation

Avoid:

- excessive bouncing
- long transitions
- distracting particle effects

Recommended transition duration:

```text
150–250ms
```

---

# 35. Chat Scrolling

When a new assistant message arrives:

```text
Scroll to latest message
```

However, do not forcibly jump the user to the bottom while they are reading older messages.

The UI should distinguish between:

```text
User is at bottom
User is reading previous messages
```

---

# 36. Input Design

The message field should support:

- placeholder text
- send button
- Enter to send
- Shift + Enter for multiline if supported
- disabled state during submission where appropriate
- character limit

Example:

```text
┌──────────────────────────────────┬─────┐
│ Ask about properties...          │  ↑  │
└──────────────────────────────────┴─────┘
```

The send button should visually communicate whether a message can be submitted.

---

# 37. Chat Session Initialization

On first open:

```text
Hi! I'm your AI Property Assistant.
I can help you find properties based on
your budget and preferences.

What are you looking for?
```

Follow with suggested actions.

---

# 38. Personalization Without Login

The MVP can personalize the conversation through session context without requiring user registration.

Example:

```text
Session ID
Requirements
Selected properties
Conversation state
```

Do not request contact details until they are useful for the sales workflow or site visit.

---

# 39. Lead-Capture UX

Lead capture should not feel like an aggressive sales form.

Instead of:

> Enter your phone number now.

Prefer:

> I can help arrange the visit. What phone number should we use for the booking?

This keeps the request connected to a user action.

---

# 40. Trust and AI Disclosure

The UI should clearly identify the assistant as AI.

Example:

```text
AI Property Assistant
```

Do not intentionally make the assistant appear to be a human representative.

---

# 41. Property Data Trust Pattern

When presenting factual data:

```text
Database → UI
```

When explaining it conversationally:

```text
Database → AI → UI
```

Never:

```text
AI → invented property fact → UI
```

---

# 42. Design System Components

Create reusable components/styles for:

```text
Button
Icon Button
Input
Textarea
Select
Badge
Status Indicator
Chat Bubble
Suggested Prompt
Property Card
Property Detail
Comparison Table
Booking Form
Booking Confirmation
Alert
Loader
Modal
Drawer
Tooltip
```

---

# 43. Button Hierarchy

## Primary

Used for:

```text
Search
Confirm Booking
Book Site Visit
```

## Secondary

Used for:

```text
Compare
View Details
Edit Preferences
```

## Tertiary

Used for:

```text
Cancel
Back
Close
```

There should normally be one dominant primary action per screen/state.

---

# 44. Status Design

Property status:

```text
Available → success badge
Reserved  → warning badge
Sold      → neutral/disabled badge
Inactive  → neutral/disabled badge
```

Booking status:

```text
Requested
Confirmed
Completed
Cancelled
```

Use both text and visual cues rather than color alone.

---

# 45. Content Guidelines

The assistant's UI copy should be:

- concise
- helpful
- professional
- human-readable
- action-oriented

Avoid overly technical wording.

Instead of:

> Query execution returned 0 rows.

Use:

> I couldn't find a matching property.

---

# 46. AI Response Style

Preferred response pattern:

```text
Acknowledge
   ↓
Answer / Action
   ↓
Next useful choice
```

Example:

> Got it. I found 4 three-bedroom villas in Hyderabad under ₹1 Cr. Would you like to compare the top two?

The assistant should not produce unnecessarily long paragraphs during transactional conversations.

---

# 47. Property Card Data Rules

Property cards should display only verified fields.

Recommended:

```text
name
price
location
property_type
bhk
area
amenities
status
```

Do not display unsupported values such as:

```text
fake ratings
fake distances
fake availability
fake discounts
fake appreciation forecasts
```

---

# 48. Booking Data Prefill

If the assistant has already collected:

```text
Name
Phone
Email
Property
```

the booking UI should prefill them.

Example:

```text
Name  [John Doe          ✓]
Phone [9876543210        ✓]
Email [john@example.com  ✓]
```

The user should still be able to edit them.

---

# 49. Design States Matrix

Every major component should support these states:

```text
Default
Hover
Focus
Active
Loading
Disabled
Success
Warning
Error
Empty
```

This is especially important for:

- buttons
- inputs
- property cards
- comparison actions
- booking actions

---

# 50. UI Security Presentation

Security failures should be communicated generically.

Do not display raw backend details.

Example:

```text
We couldn't complete that request.
Please try again.
```

Internal technical details should remain in server logs.

---

# 51. Performance UX

The interface should respond immediately to user actions.

Recommended:

```text
Click Send
   ↓
Immediately show user message
   ↓
Show typing/search state
   ↓
Render response
```

For property searches:

```text
Searching properties...
```

For booking:

```text
Creating your visit request...
```

---

# 52. Progressive Disclosure

Do not show every detail at once.

Recommended progression:

```text
Search Result
   ↓
Card Summary
   ↓
Property Details
   ↓
Compare
   ↓
Booking
```

This keeps the chat readable.

---

# 53. Conversation-to-UI Mapping

| User Intent | Recommended UI |
|---|---|
| Greeting | Welcome message + suggestions |
| Property search | Property cards |
| Budget search | Requirement summary + cards |
| Location search | Property cards |
| Property details | Detail panel/modal |
| Compare | Comparison table/cards |
| Site visit | Booking flow |
| No result | Empty state + recovery actions |
| Unknown | Guidance + suggested prompts |

---

# 54. Example Complete Experience

```text
┌───────────────────────────────────────────────┐
│ AI Property Assistant                    ×   │
│ ● Online                                      │
├───────────────────────────────────────────────┤
│                                               │
│ Hi! I can help you find a property,          │
│ compare options, or book a site visit.       │
│                                               │
│ [Find a Property] [Under ₹1 Cr]              │
│                                               │
│ You: I need a 3 BHK villa in Hyderabad.      │
│                                               │
│ AI: Great. What's your approximate budget?   │
│                                               │
│ You: Under 1 crore.                           │
│                                               │
│ AI: I found 3 matching properties.            │
│                                               │
│ ┌─────────────────────────────────────────┐   │
│ │ Green Valley Villas                     │   │
│ │ Gachibowli                              │   │
│ │ 3 BHK • 1650 sqft • ₹95 Lakh            │   │
│ │                                         │   │
│ │ [Details] [Compare] [Book Visit]       │   │
│ └─────────────────────────────────────────┘   │
│                                               │
├───────────────────────────────────────────────┤
│ Ask about properties...                   ↑  │
└───────────────────────────────────────────────┘
```

---

# 55. Design Acceptance Criteria

The design is considered complete when:

- chatbot is visually distinct from normal website content
- first-time users understand what the assistant can do
- users can start with natural language
- suggested actions are available
- requirements can be reviewed and corrected
- property results are easy to scan
- property details can be inspected without losing context
- multiple properties can be compared clearly
- site visit booking is simple
- confirmation is unmistakable
- error states offer recovery actions
- mobile experience is fully usable
- accessibility basics are implemented
- visual hierarchy remains consistent across all states

---

# 56. Design-to-Development Handoff

Design implementation should follow this order:

```text
1. Global Design Tokens
2. Layout + Typography
3. Chat Launcher
4. Chat Window
5. Message Components
6. Suggested Prompts
7. Requirement Summary
8. Property Cards
9. Property Detail View
10. Comparison UI
11. Booking UI
12. Confirmation UI
13. Loading/Error/Empty States
14. Responsive Behavior
15. Accessibility
```

---

# 57. Final Design Direction

The final product should feel like:

```text
Premium real-estate website
          +
Modern conversational AI
          +
Simple sales workflow
          +
Trustworthy property data
```

The interface should never overwhelm the visitor. Every screen should make the next useful action obvious.

The guiding UX principle is:

```text
Talk naturally.
See relevant properties.
Compare confidently.
Book easily.
```

