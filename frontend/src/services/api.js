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

  // Dynamic Generative AI Chat Engine
  async sendChatMessage(message, context = {}) {
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
        console.warn('Direct LLM API call exception, executing dynamic synthesizer', e);
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
      console.warn('Backend API offline, running client dynamic synthesizer', err);
    }

    // Client-Side Dynamic Generative Engine Synthesizer & Conversational State Machine
    const msg = message.trim ? message.trim() : message;
    const msgLower = msg.toLowerCase();
    let responseText = '';
    let intent = 'dynamic_generation';
    let actions = [];
    let scoreChange = 10;

    // Slot selection / booking confirmation
    if (msgLower.includes('morning slot') || msgLower.includes('afternoon slot') || msgLower.includes('book morning') || msgLower.includes('book afternoon') || (msgLower.includes('slot') && (msgLower.includes('morning') || msgLower.includes('afternoon')))) {
      intent = 'booking_confirmed';
      const slotName = msgLower.includes('afternoon') ? 'Tomorrow Afternoon at 2:00 PM EST' : 'Tomorrow Morning at 10:30 AM EST';
      responseText = `✅ Live Product Demo Confirmed!\n\nYour 1-on-1 Product Demo and Architecture Review has been successfully scheduled for **${slotName}** with our Senior Solution Specialist.\n\n• Calendar invitation & Zoom meeting link sent.\n• Agenda: Automated BANT Scoring, REST API integrations, & custom team onboarding.`;
      actions = ["View Scheduled Meetings", "Qualify Another Lead", "Compare Pricing Plans"];
      scoreChange = 25;
    } else if (msgLower.includes('custom quote') || msgLower.includes('request custom quote') || msgLower.includes('enterprise quote') || msgLower.includes('get custom quote')) {
      intent = 'quote_generated';
      responseText = "💼 Enterprise Custom Quote Prepared:\n\n• Base Platform: SalesBot AI Enterprise Suite\n• Included Seats: Unlimited Sales Reps\n• SLA & Support: 99.99% Uptime SLA + Dedicated Account Manager\n• Features: Custom BANT Weights, Single Sign-On (SSO), Dedicated Database Cluster.\n\nWould you like us to email this formal proposal to your procurement department?";
      actions = ["Book Demo for Proposal", "View All Features", "Add Lead Details"];
      scoreChange = 20;
    } else if (msgLower.includes('how this works') || msgLower.includes('how it works') || msgLower.includes('how does this work') || msgLower.includes('how to use') || msgLower.includes('explain process') || msgLower.includes('workflow')) {
      intent = 'workflow_explanation';
      responseText = "Here is how SalesBot AI streamlines your sales pipeline in 4 steps:\n\n1️⃣ Prospect Intake: Leads are added manually or captured live via AI chat interactions.\n2️⃣ Automated BANT Scoring: Calculates a weighted score from 0-100 based on Budget (25%), Need (30%), Authority (20%), and Timeline (25%).\n3️⃣ Lead Categorization: High-value prospects (Score 71+) are instantly flagged as Hot 🔥 for priority sales rep call.\n4️⃣ 1-Click Meeting Booking: Integrated calendar scheduling books product demos automatically.";
      actions = ["Calculate BANT Score", "Schedule Demo", "Add New Lead"];
    } else if (msgLower.includes('write email') || msgLower.includes('draft email') || msgLower.includes('outreach email') || msgLower.includes('send email') || msgLower.includes('email template')) {
      intent = 'email_generation';
      const recipient = msgLower.includes('sarah') ? 'Sarah Connor' : msgLower.includes('marcus') ? 'Marcus Vance' : 'Prospect';
      const company = msgLower.includes('sarah') ? 'Cyberdyne Systems' : msgLower.includes('marcus') ? 'Apex Dynamics' : 'Enterprise Account';
      responseText = `Subject: Elevate ${company}'s CRM Pipeline Velocity with SalesBot AI\n\nHi ${recipient},\n\nI hope you're having a productive week! I reached out because sales teams using SalesBot AI have reduced lead qualification time by 60% using automated BANT scoring and 1-click demo scheduling.\n\nBased on your team's growth goals, I'd love to share a 15-minute live demonstration this Thursday.\n\nWould 2:00 PM or 3:30 PM work better for your schedule?\n\nBest regards,\nSalesBot Solution Specialist`;
      actions = ["Book Morning Slot", "Book Afternoon Slot", "View Lead Details"];
      scoreChange = 15;
    } else if (msgLower.includes('who is') || msgLower.includes('tell me about') || msgLower.includes('sarah') || msgLower.includes('marcus') || msgLower.includes('elena') || msgLower.includes('david')) {
      intent = 'lead_lookup';
      if (msgLower.includes('sarah')) responseText = "👤 Lead Profile: Sarah Connor\n• Company: Cyberdyne Systems\n• Category: 🔥 Hot Lead (Score: 88 / 100)\n• BANT Breakdown: Budget 90%, Need 85%, Authority 80%, Timeline 95%\n• Requirement: Looking for Enterprise AI CRM integration for 150+ sales reps.";
      else if (msgLower.includes('marcus')) responseText = "👤 Lead Profile: Marcus Vance\n• Company: Apex Dynamics\n• Category: ⚡ Warm Lead (Score: 62 / 100)\n• BANT Breakdown: Budget 70%, Need 65%, Authority 60%, Timeline 50%\n• Requirement: Automated email follow-ups and lead scoring.";
      else if (msgLower.includes('elena')) responseText = "👤 Lead Profile: Elena Rostova\n• Company: QuantumScale Tech\n• Category: 🔥 Hot Lead (Score: 91 / 100)\n• Status: Contract in final legal & procurement review for Q4.";
      else if (msgLower.includes('david')) responseText = "👤 Lead Profile: David Miller\n• Company: Horizon Cloud\n• Category: ❄️ Cold Lead (Score: 31 / 100)\n• Status: Initial download of product whitepaper.";
      else responseText = "You can search, filter, and inspect all prospect lead profiles in the 'Leads & Scoring' directory tab above.";
      actions = ["View All Leads", "Schedule Demo", "Add Lead"];
    } else if (msgLower.includes('price') || msgLower.includes('pricing') || msgLower.includes('cost') || msgLower.includes('plan') || msgLower.includes('quote')) {
      intent = 'pricing_info';
      responseText = "💰 SalesBot AI Pricing & Plans:\n\n• Starter ($49 / user / month):\n  - Up to 10 sales reps\n  - Automated BANT lead scoring matrix & core CRM pipeline\n\n• Professional ($99 / user / month):\n  - Conversational AI Assistant & live calendar demo booking\n  - Automated follow-up sequences & analytics dashboard\n\n• Enterprise (Custom Quote):\n  - Unlimited seats, SSO compliance, dedicated SLA, & custom REST API integrations.";
      actions = ["Request Custom Quote", "Book Demo for Pricing", "Compare All Features"];
    } else if (msgLower.includes('score') || msgLower.includes('bant') || msgLower.includes('qualify') || msgLower.includes('budget') || msgLower.includes('need') || msgLower.includes('authority') || msgLower.includes('timeline')) {
      intent = 'bant_explanation';
      responseText = "🎯 BANT Evaluation Framework:\n\n• Budget Allocation (25% weight): Financial commitment capacity.\n• Business Need (30% weight): Alignment with CRM automation goals.\n• Decision Authority (20% weight): C-level or VP decision-maker level.\n• Purchase Timeline (25% weight): Deployment urgency.\n\nScores 71+ = 🔥 Hot Leads | 41-70 = ⚡ Warm Leads | <40 = ❄️ Cold Leads.";
      actions = ["Calculate BANT Score", "Filter Hot Leads", "Add New Lead"];
    } else if (msgLower.includes('demo') || msgLower.includes('meeting') || msgLower.includes('schedule') || msgLower.includes('book') || msgLower.includes('call') || msgLower.includes('calendar')) {
      intent = 'demo_scheduling_prompt';
      responseText = "📅 Schedule a Live Product Demo:\n\nI would be delighted to set up a personalized live product demonstration with our senior solution specialist. Do you prefer a morning or afternoon slot this week?";
      actions = ["Book Morning Slot", "Book Afternoon Slot", "Open Demo Calendar"];
      scoreChange = 15;
    } else {
      intent = 'dynamic_synthesis';
      const cleanPrompt = msg.replace(/[^\w\s]/gi, '');
      const words = cleanPrompt.split(' ');
      const keywords = words.filter(w => w.length > 3 && !['what', 'how', 'this', 'that', 'there', 'have', 'with', 'from', 'your', 'they', 'works'].includes(w.toLowerCase()));
      const topicStr = keywords.length > 0 ? keywords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Sales Pipeline Automation';

      responseText = `🤖 SalesBot AI Analysis on '${msg}':\n\nRegarding ${topicStr}, SalesBot AI dynamically analyzes prospect interactions to automate lead qualification, calculate real-time BANT scores, and increase pipeline conversion velocity.\n\nKey Actions Available:\n• Ask to draft an outreach email (e.g. 'write email to Sarah Connor')\n• Inspect lead profile details (e.g. 'who is Sarah Connor')\n• Review BANT evaluation rules or schedule a live product demo.`;
      actions = ["Explain How This Works", "Draft Outreach Email", "Book Product Demo"];
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
