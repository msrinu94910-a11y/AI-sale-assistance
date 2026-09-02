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

  // AI Chat API
  async sendChatMessage(message, context = {}) {
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      if (!res.ok) throw new Error('Failed to send chat message');
      return await res.json();
    } catch (err) {
      console.warn('Chat API offline, generating local fallback response', err);
      let intent = 'inquiry';
      let responseText = "I am your AI Sales Assistant. I can help you qualify leads, answer pricing questions, or schedule a product demo.";
      let actions = ["Calculate Lead Score", "Schedule Product Demo", "View Pricing Plans"];
      
      const lower = message.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        intent = 'pricing';
        responseText = "Our Starter plan begins at $49/user/month, offering automated lead scoring and full CRM pipeline features. Would you like a customized proposal?";
        actions = ["Get Enterprise Quote", "Compare Features", "Book Demo"];
      } else if (lower.includes('demo') || lower.includes('schedule') || lower.includes('meeting')) {
        intent = 'scheduling';
        responseText = "I can schedule a live demonstration with our solution architecture team. Would morning or afternoon work best for you?";
        actions = ["Book Morning Slot", "Book Afternoon Slot", "Select Custom Date"];
      } else if (lower.includes('score') || lower.includes('qualify') || lower.includes('bant')) {
        intent = 'qualification';
        responseText = "Our BANT framework evaluates Budget (25%), Need (30%), Authority (20%), and Timeline (25%) to dynamically score leads from 0 to 100.";
        actions = ["Score New Lead", "Filter Hot Leads", "Export Lead Matrix"];
      }

      return {
        id: Date.now(),
        message,
        response: responseText,
        intent,
        score_change: 10,
        suggested_actions: actions,
        timestamp: new Date().toISOString()
      };
    }
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
