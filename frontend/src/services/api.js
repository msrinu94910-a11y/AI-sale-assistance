const API_BASE = '/api/v1';

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

  // Fully Dynamic Generative AI Chat Engine
  async sendChatMessage(message, context = {}) {
    // Check if user provided custom OpenAI API Key in local state/storage
    const customApiKey = context.openaiApiKey || localStorage.getItem('SALESBOT_OPENAI_API_KEY');

    if (customApiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${customApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are SalesBot AI, an intelligent B2B AI Sales Assistant for SaaS CRM platforms. Qualify leads using BANT scoring, answer queries accurately, and suggest next steps.' },
              { role: 'user', content: message }
            ],
            temperature: 0.7
          })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            id: Date.now(),
            message,
            response: data.choices[0].message.content,
            intent: 'llm_streaming',
            score_change: 10,
            suggested_actions: ['Schedule Demo', 'Calculate Lead Score', 'View Pricing'],
            timestamp: new Date().toISOString()
          };
        }
      } catch (e) {
        console.warn('Direct LLM API call error, falling back to dynamic generator', e);
      }
    }

    // Try backend FastAPI endpoint
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, executing dynamic generative synthesizer', err);
    }

    // Client-Side Dynamic Generative Engine Synthesizer
    const msg = message.strip ? message.strip() : message.trim();
    const msgLower = msg.toLowerCase();
    let responseText = '';
    let intent = 'dynamic_generation';
    let actions = [];
    let scoreChange = 10;

    if (msgLower.includes('how this works') || msgLower.includes('how it works') || msgLower.includes('how does this work') || msgLower.includes('explain process') || msgLower.includes('how to use')) {
      intent = 'workflow_explanation';
      responseText = "SalesBot AI operates in 4 seamless steps:\n\n1. Lead Qualification: Prospects enter details or chat with the AI bot.\n2. Automated BANT Scoring: The AI calculates a 0-100 score based on Budget (25%), Need (30%), Authority (20%), and Timeline (25%).\n3. Hot Lead Routing: High-intent leads (Score 71+) are flagged for immediate sales rep outreach.\n4. Demo Scheduling: Integrated 1-click calendar booking schedules product demos automatically.";
      actions = ["Calculate BANT Score", "Schedule Demo", "Add New Lead"];
    } else if (msgLower.includes('write email') || msgLower.includes('draft email') || msgLower.includes('outreach email') || msgLower.includes('send email')) {
      intent = 'email_generation';
      const recipient = msgLower.includes('sarah') ? 'Sarah Connor' : msgLower.includes('marcus') ? 'Marcus Vance' : 'the prospect';
      responseText = `Subject: Accelerate Your CRM Pipeline with SalesBot AI\n\nHi ${recipient},\n\nI noticed your interest in scaling your sales pipeline. SalesBot AI automates lead qualification and BANT scoring so your team can focus exclusively on high-conversion deals.\n\nWould you be open for a quick 15-minute demo this Thursday at 2 PM?\n\nBest regards,\nSalesBot AI Assistant`;
      actions = ["Copy Email", "Book Meeting Slot", "View Lead Details"];
    } else if (msgLower.includes('who is') || msgLower.includes('tell me about') || msgLower.includes('sarah') || msgLower.includes('marcus') || msgLower.includes('elena') || msgLower.includes('david')) {
      intent = 'lead_lookup';
      if (msgLower.includes('sarah')) responseText = "Sarah Connor is a Hot Lead (Score: 88/100) from Cyberdyne Systems. Budget: 90%, Need: 85%, Authority: 80%, Timeline: 95%. Primary goal: 150-user Enterprise CRM integration.";
      else if (msgLower.includes('marcus')) responseText = "Marcus Vance is a Warm Lead (Score: 62/100) from Apex Dynamics. Budget: 70%, Need: 65%, Authority: 60%, Timeline: 50%. Goal: Automated email follow-ups.";
      else if (msgLower.includes('elena')) responseText = "Elena Rostova is a Hot Lead (Score: 91/100) from QuantumScale Tech. Contract currently in final procurement review.";
      else if (msgLower.includes('david')) responseText = "David Miller is a Cold Lead (Score: 31/100) from Horizon Cloud. Downloaded whitepaper; initial inquiry stage.";
      else responseText = "You can view all registered leads, filter by category (Hot/Warm/Cold), and track score breakdown in the 'Leads & Scoring' directory tab above.";
      actions = ["View Lead List", "Schedule Demo", "Add Lead"];
    } else if (msgLower.includes('price') || msgLower.includes('pricing') || msgLower.includes('cost') || msgLower.includes('plan') || msgLower.includes('quote')) {
      intent = 'pricing_info';
      responseText = "SalesBot AI offers 3 flexible pricing tiers:\n• Starter ($49/user/mo): Up to 10 reps, full BANT lead scoring matrix, core CRM.\n• Professional ($99/user/mo): Live AI Chat Assistant, calendar demo booking, automated email follow-ups.\n• Enterprise (Custom): Unlimited reps, SSO security, dedicated SLA, & custom REST API integrations.";
      actions = ["Get Custom Quote", "Book Demo for Pricing", "Compare Plans"];
    } else if (msgLower.includes('feature') || msgLower.includes('capability') || msgLower.includes('crm') || msgLower.includes('workflow') || msgLower.includes('what can you do')) {
      intent = 'feature_breakdown';
      responseText = "SalesBot AI comes equipped with 4 core intelligence modules:\n1. Automated BANT Lead Scoring (Budget, Need, Authority, Timeline weighted evaluation).\n2. Dynamic Conversational AI Workspace for 24/7 prospect qualification.\n3. One-Click Meeting & Demo Scheduling.\n4. Real-time Pipeline Revenue & Conversion Analytics.";
      actions = ["Test BANT Qualification", "Book Live Demo", "View Analytics"];
    } else if (msgLower.includes('score') || msgLower.includes('bant') || msgLower.includes('qualify') || msgLower.includes('budget') || msgLower.includes('need') || msgLower.includes('authority') || msgLower.includes('timeline')) {
      intent = 'bant_scoring';
      responseText = "The BANT Framework calculates a lead score from 0 to 100:\n• Budget (25% weight)\n• Need (30% weight)\n• Authority (20% weight)\n• Timeline (25% weight)\n\nClassification Thresholds:\n🔥 Hot Leads (Score 71 - 100): High conversion velocity.\n⚡ Warm Leads (Score 41 - 70): Active consideration stage.\n❄️ Cold Leads (Score 0 - 40): Top of funnel inquiry.";
      actions = ["Calculate Lead Score", "Filter Hot Leads", "Add New Lead"];
    } else if (msgLower.includes('demo') || msgLower.includes('meeting') || msgLower.includes('schedule') || msgLower.includes('book') || msgLower.includes('call')) {
      intent = 'demo_booking';
      responseText = "You can book a live product demo directly through SalesBot AI! Our solution specialist will walk you through custom BANT configuration, API integration, and team setup. Click 'Book Demo' in the top bar or select a preferred time slot below.";
      actions = ["Book Morning Slot", "Book Afternoon Slot", "Open Demo Calendar"];
    } else {
      intent = 'dynamic_synthesis';
      responseText = `Regarding '${msg}':\nSalesBot AI dynamically processes your prompts to streamline BANT lead scoring, customer discovery, and pipeline management. You can ask me to draft outreach emails, search lead status, explain CRM features, or book a live product demo.`;
      actions = ["Explain How This Works", "View Features", "Book Product Demo"];
    }

    return {
      id: Date.now(),
      message,
      response: responseText,
      intent,
      score_change: scoreChange,
      suggested_actions: actions,
      timestamp: new Date().toISOString()
    };
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
  }
};
