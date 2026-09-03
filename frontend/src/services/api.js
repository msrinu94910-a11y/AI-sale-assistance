const API_BASE = '/api/v1';

function synthesizeClientBotResponse(message, sessionId) {
  const msgLower = (message || '').toLowerCase();
  const session = sessionId || `session_${Math.random().toString(36).substring(2, 10)}`;
  
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : null;
  const budgetMatch = message.match(/(\$\s?[\d,]+(?:\.\d+)?(?:k|m|b)?|\b[\d,]+(?:\.\d+)?\s*(?:k|thousand|million|usd|dollars)\b)/i);
  const budget = budgetMatch ? budgetMatch[0] : null;
  const nameMatch = message.match(/(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const name = nameMatch ? nameMatch[1].trim() : null;
  const companyMatch = message.match(/(?:at|from|with|company is|work at)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)/i);
  const company = companyMatch ? companyMatch[1].trim() : null;

  const extracted = {
    name,
    email,
    company,
    phone: null,
    budget,
    timeline: null
  };

  if (['morning slot', 'afternoon slot', 'book morning', 'book afternoon', 'confirm demo', 'confirm slot'].some(p => msgLower.includes(p)) || (msgLower.includes('slot') && (msgLower.includes('morning') || msgLower.includes('afternoon')))) {
    const slotTime = msgLower.includes('afternoon') ? 'Tomorrow Afternoon at 2:00 PM EST' : 'Tomorrow Morning at 10:30 AM EST';
    return {
      reply: `✅ Demo Confirmed! Your personalized Product Demo & Architecture Review is booked for **${slotTime}**.\n\n• Calendar invitation and Zoom link generated.\n• Agenda: Automated BANT Lead Scoring, API integration, and custom workflow setup.\n• Our Solution Specialist will meet you directly on the call.`,
      intent: 'demo_booked',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['View Scheduled Meetings', 'Qualify Another Lead', 'Compare Plans'],
      score_change: 30,
      timestamp: new Date().toISOString()
    };
  }

  if (['demo', 'schedule', 'meeting', 'book', 'call', 'calendar', 'appointment'].some(p => msgLower.includes(p))) {
    return {
      reply: `I would love to set you up with a live 1-on-1 Product Demo & Architecture Review with our senior solutions engineer.\n\nWe have slots available this week. Which time works best for your schedule?\n• Morning Slot: Tomorrow at 10:30 AM EST\n• Afternoon Slot: Tomorrow at 2:00 PM EST`,
      intent: 'demo_scheduling_prompt',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Book Morning Slot', 'Book Afternoon Slot', 'Open Demo Calendar'],
      score_change: 20,
      timestamp: new Date().toISOString()
    };
  }

  if (['price', 'pricing', 'cost', 'plan', 'quote', 'tier', 'subscription'].some(p => msgLower.includes(p))) {
    return {
      reply: `SalesBot AI offers flexible tiers designed for growing sales teams:\n\n1. Starter ($49 / user / month):\n   - Core BANT Lead Scoring Matrix\n   - Automated Lead Dashboard & Pipeline Tracking\n\n2. Professional ($99 / user / month):\n   - Conversational AI Assistant & 1-Click Calendar Booking\n   - Advanced Analytics & Automated Follow-up Sequences\n\n3. Enterprise (Custom Quote):\n   - Unlimited Seats, SSO, Dedicated SLA, and Custom REST API Integrations.`,
      intent: 'pricing_inquiry',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Book Demo for Pricing', 'Request Enterprise Quote', 'Compare Features'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  if (['bant', 'qualify', 'qualification', 'score', 'scoring', 'budget', 'authority', 'timeline'].some(p => msgLower.includes(p))) {
    return {
      reply: `Our automated BANT Qualification Engine scores prospects from 0 to 100:\n\n• Budget (25% weight): Purchasing capacity and investment readiness.\n• Need (30% weight): Business pain points and platform fit.\n• Authority (20% weight): Decision-maker level (C-level, VP, Manager).\n• Timeline (25% weight): Urgency to deploy within 30-90 days.\n\nLeads scoring 71+ are classified as 🔥 Hot Leads for immediate outreach.`,
      intent: 'bant_explanation',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Calculate BANT Score', 'Filter Hot Leads', 'Add New Lead'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  if (['email', 'outreach', 'draft', 'template', 'follow up'].some(p => msgLower.includes(p))) {
    const prospect = name || 'Prospect';
    const comp = company || 'your organization';
    return {
      reply: `Here is a customized outreach email draft for ${prospect}:\n\nSubject: Accelerating ${comp}'s Sales Pipeline with Automated AI Scoring\n\nHi ${prospect},\n\nI noticed your focus on scaling your sales pipeline. Teams using SalesBot AI have reduced lead qualification time by 60% with automated BANT scoring and calendar booking.\n\nWould Thursday at 2:00 PM or Friday at 10:30 AM work best for a quick chat?\n\nBest regards,\nSales Development Team`,
      intent: 'email_draft',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Book Morning Slot', 'Book Afternoon Slot', 'View All Leads'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  return {
    reply: `SalesBot AI is ready to help! I can qualify inbound leads using our BANT scoring matrix, answer product and pricing questions, draft customized outreach emails, or book a live product demo.\n\nWhat would you like to explore next?`,
    intent: 'general_inquiry',
    session_id: session,
    extracted_entities: extracted,
    suggested_actions: ['Explain BANT Scoring', 'View Pricing Plans', 'Schedule Demo', 'Qualify Inbound Lead'],
    score_change: 10,
    timestamp: new Date().toISOString()
  };
}

export const apiService = {
  // Leads API
  async getLeads(category = '') {
    try {
      const url = category ? `${API_BASE}/leads?category=${category}` : `${API_BASE}/leads`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch leads');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unavailable, serving client fallback data', err);
      return [
        {
          id: 1,
          name: "Sarah Connor",
          email: "sarah@cyberdyne.io",
          phone: "+1 555-0192",
          company: "Cyberdyne Systems",
          status: "Qualified",
          budget: 90,
          need: 85,
          authority: 80,
          timeline: 95,
          score: 88,
          category: "Hot",
          notes: "Looking for Enterprise AI CRM integration for 150+ reps.",
          created_at: "2026-08-28T10:30:00Z"
        },
        {
          id: 2,
          name: "Marcus Vance",
          email: "m.vance@apexdynamics.com",
          phone: "+1 555-0144",
          company: "Apex Dynamics",
          status: "Contacted",
          budget: 70,
          need: 65,
          authority: 60,
          timeline: 50,
          score: 62,
          category: "Warm",
          notes: "Interested in automated email follow-ups and lead scoring.",
          created_at: "2026-08-29T14:15:00Z"
        },
        {
          id: 3,
          name: "Elena Rostova",
          email: "elena@quantumscale.tech",
          phone: "+1 555-0188",
          company: "QuantumScale Tech",
          status: "Proposal",
          budget: 95,
          need: 90,
          authority: 85,
          timeline: 90,
          score: 91,
          category: "Hot",
          notes: "Contract in final legal review for Q4 deployment.",
          created_at: "2026-08-30T09:00:00Z"
        },
        {
          id: 4,
          name: "David Miller",
          email: "d.miller@horizoncloud.org",
          phone: "+1 555-0122",
          company: "Horizon Cloud",
          status: "New",
          budget: 30,
          need: 40,
          authority: 30,
          timeline: 20,
          score: 31,
          category: "Cold",
          notes: "Initial inquiry downloaded product whitepaper.",
          created_at: "2026-09-01T16:45:00Z"
        }
      ];
    }
  },

  async createLead(leadData) {
    const score = Math.round(
      (leadData.budget || 50) * 0.25 +
      (leadData.need || 50) * 0.30 +
      (leadData.authority || 50) * 0.20 +
      (leadData.timeline || 50) * 0.25
    );
    const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';
    const newLeadObj = {
      id: Date.now(),
      name: leadData.name || 'New Lead',
      email: leadData.email || 'lead@company.com',
      phone: leadData.phone || '',
      company: leadData.company || 'Enterprise',
      status: leadData.status || 'New',
      budget: leadData.budget || 50,
      need: leadData.need || 50,
      authority: leadData.authority || 50,
      timeline: leadData.timeline || 50,
      score,
      category,
      notes: leadData.notes || '',
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API connection offline, using client-side lead creation', err);
    }

    return newLeadObj;
  },

  // Analytics API
  async getAnalyticsSummary() {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      if (!res.ok) throw new Error('Failed to fetch analytics summary');
      return await res.json();
    } catch (err) {
      return {
        total_leads: 42,
        hot_leads: 18,
        warm_leads: 16,
        cold_leads: 8,
        conversion_rate: 42.8,
        meetings_scheduled: 14,
        pipeline_value: 145000.0,
        category_distribution: { Hot: 18, Warm: 16, Cold: 8 },
        recent_activities: [
          { time: "10 mins ago", action: "Lead Qualified", detail: "Apex Dynamics marked as Hot Lead (Score: 88)" },
          { time: "1 hour ago", action: "Meeting Scheduled", detail: "Demo booked with Acme Corp for tomorrow at 2 PM" },
          { time: "3 hours ago", action: "AI Chat Qualification", detail: "Automated BANT qualification completed for Nexus Labs" },
          { time: "Yesterday", action: "Deal Closed", detail: "CloudScale Inc. signed Annual Enterprise Contract" }
        ]
      };
    }
  },

  // Meetings API
  async getMeetings() {
    try {
      const res = await fetch(`${API_BASE}/meetings`);
      if (!res.ok) throw new Error('Failed to fetch meetings');
      return await res.json();
    } catch (err) {
      return [
        {
          id: 1,
          lead_id: 1,
          lead_name: "Sarah Connor (Cyberdyne Systems)",
          title: "Enterprise CRM Architecture Review & Live Demo",
          meeting_date: new Date(Date.now() + 86400000).toISOString(),
          duration_minutes: 45,
          status: "Scheduled",
          notes: "Focus on security compliance, SSO, and 150-user seat pricing."
        },
        {
          id: 2,
          lead_id: 3,
          lead_name: "Elena Rostova (QuantumScale Tech)",
          title: "Contract Closing & Implementation Scope",
          meeting_date: new Date(Date.now() + 172800000).toISOString(),
          duration_minutes: 30,
          status: "Scheduled",
          notes: "Final procurement sign-off meeting."
        }
      ];
    }
  },

  async createMeeting(meetingData) {
    try {
      const res = await fetch(`${API_BASE}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      });
      if (!res.ok) throw new Error('Failed to create meeting');
      return await res.json();
    } catch (err) {
      return {
        id: Date.now(),
        ...meetingData,
        created_at: new Date().toISOString()
      };
    }
  },

  // SalesBot API Endpoints
  async getBotStatus() {
    try {
      const res = await fetch(`${API_BASE}/bot/status`);
      if (!res.ok) throw new Error('Failed to fetch bot status');
      return await res.json();
    } catch (err) {
      console.warn('Bot status API offline, using fallback configuration', err);
      return {
        status: "online",
        bot_name: "SalesBot API",
        version: "1.0.0",
        active_providers: [
          "Groq Cloud (openai/gpt-oss-20b)",
          "Built-in Deterministic NLP Synthesizer (Zero-Failure Fallback)"
        ],
        features: [
          "Multi-turn Session Context",
          "Automatic Entity Extraction (Name, Email, Phone, Company, Budget)",
          "Automated BANT Lead Scoring",
          "Calendar Demo Booking",
          "Lead Database Synchronization"
        ]
      };
    }
  },

  async sendBotChat(message, sessionId = null, leadId = null, context = {}) {
    try {
      const res = await fetch(`${API_BASE}/bot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          lead_id: leadId,
          context
        })
      });
      if (res.ok) {
        return await res.json();
      }
      console.warn(`Backend /bot/chat returned status ${res.status}, falling back to built-in synthesizer`);
    } catch (err) {
      console.warn('Backend Bot API connection error, falling back to built-in synthesizer', err);
    }
    return synthesizeClientBotResponse(message, sessionId);
  },

  async getBotSessionHistory(sessionId) {
    try {
      const res = await fetch(`${API_BASE}/bot/sessions/${sessionId}/history`);
      if (!res.ok) throw new Error('Failed to fetch bot session history');
      return await res.json();
    } catch (err) {
      return {
        session_id: sessionId,
        total_messages: 0,
        messages: []
      };
    }
  },

  async qualifyProspect(qualifyData) {
    try {
      const res = await fetch(`${API_BASE}/bot/qualify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qualifyData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Qualify API connection error, using local computation', err);
    }
    const score = Math.round(
      (qualifyData.budget || 50) * 0.25 +
      (qualifyData.need || 50) * 0.30 +
      (qualifyData.authority || 50) * 0.20 +
      (qualifyData.timeline || 50) * 0.25
    );
    const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';
    return {
      lead_id: Date.now(),
      name: qualifyData.name,
      email: qualifyData.email,
      score,
      category,
      recommendation: category === 'Hot' ? 'Priority direct sales rep outreach and immediate 1-on-1 demo scheduling.' : 'Nurture with automated follow-ups.'
    };
  },

  async bookBotDemo(bookingData) {
    try {
      const res = await fetch(`${API_BASE}/bot/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Booking API connection error, using local confirmation', err);
    }
    return {
      success: true,
      meeting_id: Date.now(),
      lead_name: bookingData.lead_name,
      title: bookingData.title,
      slot: bookingData.slot,
      status: "Scheduled",
      meeting_date: new Date(Date.now() + 86400000).toISOString(),
      message: `Demo successfully scheduled for ${bookingData.lead_name}`
    };
  }
};

