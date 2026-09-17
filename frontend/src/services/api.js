const API_BASE = '/api/v1';

function synthesizeClientBotResponse(message, sessionId) {
  const msgLower = (message || '').toLowerCase();
  const session = sessionId || `session_${Math.random().toString(36).substring(2, 10)}`;
  
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : null;
  const budgetMatch = message.match(/(\$\s?[\d,]+(?:\.\d+)?(?:k|m|b)?|\b[\d,]+(?:\.\d+)?\s*(?:k|thousand|million|usd|dollars|cr|crore|lakh)\b)/i);
  const budget = budgetMatch ? budgetMatch[0] : null;
  const nameMatch = message.match(/(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const name = nameMatch ? nameMatch[1].trim() : null;

  const extracted = {
    name,
    email,
    company: null,
    phone: null,
    budget,
    timeline: null,
    location: null,
    property_type: null
  };

  if (['morning', 'afternoon', 'book', 'schedule', 'visit', 'tour', 'confirm'].some(p => msgLower.includes(p)) && msgLower.includes('slot')) {
    const slotTime = msgLower.includes('afternoon') ? 'Tomorrow Afternoon at 2:00 PM' : 'Tomorrow Morning at 10:30 AM';
    return {
      reply: `✅ Site Visit Confirmed! Your property tour is scheduled for **${slotTime}**.\n\n• Our sales agent will meet you at the property location.\n• You will receive a calendar invitation and location map shortly.\n• We look forward to showing you around!`,
      intent: 'demo_booked',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['View Scheduled Visits', 'Search More Properties', 'Contact Agent'],
      score_change: 30,
      timestamp: new Date().toISOString()
    };
  }

  if (['visit', 'tour', 'see', 'schedule', 'meeting', 'book', 'appointment'].some(p => msgLower.includes(p))) {
    return {
      reply: `I would love to arrange a site visit for you to see our properties in person.\n\nWe have slots available this week. Which time works best for you?\n• Morning Slot: Tomorrow at 10:30 AM\n• Afternoon Slot: Tomorrow at 2:00 PM`,
      intent: 'demo_scheduling_prompt',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Book Morning Slot', 'Book Afternoon Slot', 'Ask for Location'],
      score_change: 20,
      timestamp: new Date().toISOString()
    };
  }

  if (['price', 'pricing', 'cost', 'budget', 'crore', 'lakh'].some(p => msgLower.includes(p))) {
    return {
      reply: `We have a wide range of properties to fit different budgets:\n\n1. Luxury Villas (₹2 Cr - ₹5 Cr+):\n   - Premium amenities, gated communities, private pools.\n\n2. Premium Apartments (₹80 Lakhs - ₹2 Cr):\n   - 2 BHK & 3 BHK options in prime locations.\n\n3. Residential Plots (₹50 Lakhs - ₹1.5 Cr):\n   - Great for investment or custom home building.\n\nWhat is your approximate budget?`,
      intent: 'pricing_inquiry',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Under 1 Crore', '1 to 2 Crores', 'Above 2 Crores'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  if (['amenities', 'facility', 'pool', 'gym', 'clubhouse', 'parking'].some(p => msgLower.includes(p))) {
    return {
      reply: `Our premium properties come with world-class amenities, including:\n\n• Fully equipped Gym & Clubhouse\n• Swimming Pool & Kids Play Area\n• 24/7 Security & Power Backup\n• Dedicated Car Parking\n• Landscaped Gardens & Walking Tracks\n\nAre there any specific amenities you are looking for?`,
      intent: 'features_inquiry',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Find Apartments', 'Schedule Site Visit', 'Modify Requirements'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  const locationMatch = ['gachibowli', 'kondapur', 'madhapur', 'jubilee hills', 'narsingi'].find(loc => msgLower.includes(loc));
  if (locationMatch) {
    extracted.location = locationMatch.charAt(0).toUpperCase() + locationMatch.slice(1);
    return {
      reply: `Great! We have beautiful properties in **${extracted.location}**.\n\nCould you let me know your approximate budget or preferred property type (Villa, Apartment, Plot)?`,
      intent: 'requirement_gathering',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Find Apartments', 'Find Villas', 'Under 2 Crores'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  if (['location', 'where', 'area', 'city'].some(p => msgLower.includes(p))) {
    return {
      reply: `📍 **Prime Locations Available**:\n\nWe have excellent properties in top areas including Gachibowli, Kondapur, Madhapur, Jubilee Hills, and Narsingi.\n\nEach location offers great connectivity, proximity to IT parks, and premium lifestyle conveniences.\n\nWhich area are you most interested in?`,
      intent: 'location_inquiry',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Gachibowli', 'Kondapur', 'Narsingi'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  if (['contact', 'support', 'help', 'reach', 'agent', 'human', 'representative', 'call'].some(p => msgLower.includes(p))) {
    return {
      reply: `📞 **Connect with our Real Estate Agents**:\n\nOur team is ready to assist you:\n• **Site Visit**: Book a property tour using our calendar.\n• **Direct Support**: Email sales@propertyai.com or request an immediate call back.\n• **Office Visit**: Drop by our sales office for a detailed consultation.`,
      intent: 'contact_inquiry',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Book Site Visit', 'Request Call Back'],
      score_change: 10,
      timestamp: new Date().toISOString()
    };
  }

  if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon'].some(p => msgLower.includes(p)) && message.split(' ').length <= 4) {
    return {
      reply: `Hello! 👋 I am your **Property Sales AI Assistant**.\n\nI can help you discover available properties, compare options, check prices, and book site visits.\n\nAre you looking for an apartment, villa, or plot today?`,
      intent: 'greeting',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Find Apartments', 'Find Villas', 'Search Properties'],
      score_change: 5,
      timestamp: new Date().toISOString()
    };
  }

  const propertyTypeMatch = ['villa', 'apartment', 'flat', 'plot'].find(type => msgLower.includes(type));
  const bhkMatch = message.match(/(\d)\s*(?:bhk|bedroom|bed)/i);
  
  if (propertyTypeMatch || bhkMatch) {
    if (propertyTypeMatch) extracted.property_type = propertyTypeMatch.charAt(0).toUpperCase() + propertyTypeMatch.slice(1);
    if (bhkMatch) extracted.bhk = parseInt(bhkMatch[1], 10);
    
    let propDesc = [];
    if (extracted.bhk) propDesc.push(`${extracted.bhk} BHK`);
    if (extracted.property_type) propDesc.push(extracted.property_type);
    
    return {
      reply: `Excellent! You're looking for a **${propDesc.join(' ')}**. We have several premium options available.\n\nCould you let me know your preferred location (e.g., Gachibowli, Kondapur) and your approximate budget?`,
      intent: 'requirement_gathering',
      session_id: session,
      extracted_entities: extracted,
      suggested_actions: ['Gachibowli', 'Kondapur', 'Under 2 Cr'],
      score_change: 15,
      timestamp: new Date().toISOString()
    };
  }

  return {
    reply: `💡 I can help you find your perfect home. Tell me a bit about what you are looking for—like your preferred location, budget, or whether you want an apartment or a villa.\n\nWe have listings across major areas. Would you like to schedule a site visit or browse properties?`,
    intent: 'general_inquiry',
    session_id: session,
    extracted_entities: extracted,
    suggested_actions: ['Find 3 BHK', 'Show Villas', 'Book Site Visit'],
    score_change: 10,
    timestamp: new Date().toISOString()
  };
}

// Local Storage Keys & Fallback Helpers
const LOCAL_LEADS_KEY = 'salesbot_persistent_leads';
const LOCAL_MEETINGS_KEY = 'salesbot_persistent_meetings';
const LOCAL_PROPERTIES_KEY = 'salesbot_persistent_properties';

function getLocalProperties() {
  try {
    const data = localStorage.getItem(LOCAL_PROPERTIES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalProperties(properties) {
  try {
    localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(properties));
  } catch (e) {}
}

function getLocalLeads() {
  try {
    const data = localStorage.getItem(LOCAL_LEADS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalLeads(leads) {
  try {
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {}
}

function getLocalMeetings() {
  try {
    const data = localStorage.getItem(LOCAL_MEETINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalMeetings(meetings) {
  try {
    localStorage.setItem(LOCAL_MEETINGS_KEY, JSON.stringify(meetings));
  } catch (e) {}
}

const DEFAULT_INITIAL_LEADS = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah@cyberdyne.io",
    phone: "+1 555-0192",
    company: "Cyberdyne Systems",
    status: "Qualified",
    location_preference: "Hyderabad",
    property_type_preference: "Villa",
    bhk_preference: 4,
    budget_max: 20000000,
    score: 88,
    category: "Hot",
    notes: "Looking for premium 4 BHK villa with immediate move-in.",
    created_at: "2026-08-28T10:30:00Z"
  },
  {
    id: 2,
    name: "Marcus Vance",
    email: "m.vance@apexdynamics.com",
    phone: "+1 555-0144",
    company: "Apex Dynamics",
    status: "Contacted",
    location_preference: "Kondapur",
    property_type_preference: "Apartment",
    bhk_preference: 3,
    budget_max: 12000000,
    score: 62,
    category: "Warm",
    notes: "Interested in high-rise apartments with amenities.",
    created_at: "2026-08-29T14:15:00Z"
  },
  {
    id: 3,
    name: "Elena Rostova",
    email: "elena@quantumscale.tech",
    phone: "+1 555-0188",
    company: "QuantumScale Tech",
    status: "Proposal",
    location_preference: "Gachibowli",
    property_type_preference: "Apartment",
    bhk_preference: 3,
    budget_max: 15000000,
    score: 91,
    category: "Hot",
    notes: "Requires loan assistance, but ready to finalize.",
    created_at: "2026-08-30T09:00:00Z"
  },
  {
    id: 4,
    name: "David Miller",
    email: "d.miller@horizoncloud.org",
    phone: "+1 555-0122",
    company: "Horizon Cloud",
    status: "New",
    location_preference: null,
    property_type_preference: "Plot",
    bhk_preference: null,
    budget_max: 5000000,
    score: 31,
    category: "Cold",
    notes: "Initial inquiry exploring plot investments.",
    created_at: "2026-09-01T16:45:00Z"
  }
];

const DEFAULT_INITIAL_MEETINGS = [
  {
    id: 1,
    lead_id: 1,
    lead_name: "Sarah Connor (Cyberdyne Systems)",
    title: "Premium Villa Site Visit",
    meeting_date: new Date(Date.now() + 86400000).toISOString(),
    duration_minutes: 60,
    status: "Scheduled",
    notes: "Focus on gated community amenities and custom interior options."
  },
  {
    id: 2,
    lead_id: 3,
    lead_name: "Elena Rostova (QuantumScale Tech)",
    title: "Apartment Tour & Loan Discussion",
    meeting_date: new Date(Date.now() + 172800000).toISOString(),
    duration_minutes: 60,
    status: "Scheduled",
    notes: "Final sign-off meeting at the property."
  }
];

const DEFAULT_INITIAL_PROPERTIES = [
  {
    id: 1,
    name: "Green Valley Villas",
    description: "Luxury 4 BHK villas with private garden and pool.",
    location: "Gachibowli",
    property_type: "Villa",
    bhk: 4,
    price: 25000000,
    area: "4000 sqft",
    amenities: "Pool, Gym, Garden, 24/7 Security"
  },
  {
    id: 2,
    name: "Urban Nest",
    description: "Modern 3 BHK apartments in the heart of the city.",
    location: "Kondapur",
    property_type: "Apartment",
    bhk: 3,
    price: 12000000,
    area: "1800 sqft",
    amenities: "Clubhouse, Park, Power Backup"
  },
  {
    id: 3,
    name: "Lakeview Residences",
    description: "Spacious 3 BHK apartments with lake view.",
    location: "Kondapur",
    property_type: "Apartment",
    bhk: 3,
    price: 14000000,
    area: "2000 sqft",
    amenities: "Lake View, Gym, Jogging Track"
  },
  {
    id: 4,
    name: "Sunset Plots",
    description: "Premium villa plots for custom homes.",
    location: "Narsingi",
    property_type: "Plot",
    bhk: null,
    price: 8000000,
    area: "300 sq yds",
    amenities: "Gated Community, Water, Electricity"
  },
  {
    id: 5,
    name: "Elite Towers",
    description: "High-rise luxury 2 BHK apartments.",
    location: "Madhapur",
    property_type: "Apartment",
    bhk: 2,
    price: 9500000,
    area: "1200 sqft",
    amenities: "Infinity Pool, Smart Home, Concierge"
  }
];

export const apiService = {
  // Leads API
  async getLeads(category = '') {
    try {
      const url = category ? `${API_BASE}/leads?category=${category}` : `${API_BASE}/leads`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch leads');
      const leads = await res.json();
      if (leads && leads.length > 0) {
        saveLocalLeads(leads);
      }
      return leads;
    } catch (err) {
      console.warn('Backend API unavailable, serving local persistent lead data', err);
      let local = getLocalLeads();
      if (!local || local.length === 0) {
        local = DEFAULT_INITIAL_LEADS;
        saveLocalLeads(local);
      }
      if (category) {
        return local.filter(l => (l.category || '').toLowerCase() === category.toLowerCase());
      }
      return local;
    }
  },

  async createLead(leadData) {
    let createdObj = null;
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        createdObj = await res.json();
      }
    } catch (err) {
      console.warn('API connection offline, using client-side lead creation', err);
    }

    if (!createdObj) {
      let score = 50;
      if (leadData.location_preference) score += 10;
      if (leadData.budget_max) score += 20;
      if (leadData.bhk_preference || leadData.property_type_preference) score += 10;
      if (leadData.phone || leadData.email) score += 10;
      
      const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';
      createdObj = {
        id: Date.now(),
        name: leadData.name || 'New Lead',
        email: leadData.email || 'lead@company.com',
        phone: leadData.phone || '',
        company: leadData.company || 'Enterprise',
        status: leadData.status || 'New',
        location_preference: leadData.location_preference || null,
        property_type_preference: leadData.property_type_preference || null,
        bhk_preference: leadData.bhk_preference || null,
        budget_max: leadData.budget_max || null,
        score,
        category,
        notes: leadData.notes || '',
        created_at: new Date().toISOString()
      };
    }

    let local = getLocalLeads();
    if (!local || local.length === 0) {
      local = DEFAULT_INITIAL_LEADS;
    }
    const filtered = local.filter(l => l.id !== createdObj.id);
    const updatedList = [createdObj, ...filtered];
    saveLocalLeads(updatedList);

    return createdObj;
  },

  async updateLead(leadId, leadData) {
    let updatedObj = null;
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        updatedObj = await res.json();
      }
    } catch (err) {
      console.warn('API update unavailable, updating client-side', err);
    }

    if (!updatedObj) {
      let score = 50;
      if (leadData.location_preference) score += 10;
      if (leadData.budget_max) score += 20;
      if (leadData.bhk_preference || leadData.property_type_preference) score += 10;
      if (leadData.phone || leadData.email) score += 10;

      const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';
      updatedObj = {
        id: leadId,
        ...leadData,
        score,
        category
      };
    }

    let local = getLocalLeads();
    if (local) {
      local = local.map(l => l.id === leadId ? { ...l, ...updatedObj } : l);
      saveLocalLeads(local);
    }

    return updatedObj;
  },

  async deleteLead(leadId) {
    try {
      await fetch(`${API_BASE}/leads/${leadId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('API delete unavailable, deleting client-side', err);
    }
    let local = getLocalLeads();
    if (local) {
      saveLocalLeads(local.filter(l => l.id !== leadId));
    }
    return true;
  },

  async exportLeadsCSV(category = '') {
    try {
      const url = category && category !== 'All' ? `${API_BASE}/leads/export?category=${category}` : `${API_BASE}/leads/export`;
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `leads_export_${category ? category.toLowerCase() : 'all'}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        return true;
      }
    } catch (err) {
      console.warn('API export unavailable, exporting local client-side leads', err);
    }

    let leads = getLocalLeads() || DEFAULT_INITIAL_LEADS;
    if (category && category !== 'All') {
      leads = leads.filter(l => (l.category || '').toLowerCase() === category.toLowerCase());
    }

    const headers = ['id', 'name', 'email', 'phone', 'status', 'location', 'property_type', 'bhk', 'budget_max', 'score', 'category', 'notes', 'created_at'];
    const rows = leads.map(l => [
      l.id || '',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.status || 'New').replace(/"/g, '""')}"`,
      `"${(l.location_preference || '').replace(/"/g, '""')}"`,
      `"${(l.property_type_preference || '').replace(/"/g, '""')}"`,
      l.bhk_preference || '',
      l.budget_max || '',
      l.score ?? 50,
      `"${(l.category || 'Warm').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.created_at || new Date().toISOString()).replace(/"/g, '""')}"`
    ].join(','));

    const csvStr = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `leads_export_${category ? category.toLowerCase() : 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  },

  async importLeadsCSV(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/leads/import`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          let local = getLocalLeads() || DEFAULT_INITIAL_LEADS;
          const updated = [...data.leads, ...local];
          saveLocalLeads(updated);
        }
        return data;
      }
    } catch (err) {
      console.warn('API import unavailable, parsing CSV client-side', err);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
          if (lines.length <= 1) {
            resolve({ success: false, imported_count: 0, errors: ['CSV file appears empty or has no header row.'], leads: [] });
            return;
          }

          const headerRow = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
          const importedLeads = [];
          const errors = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const rawTokens = line.split(',');
            // Recombine quoted values split by comma
            const values = [];
            let inQuotes = false;
            let currentToken = '';
            for (let char of line) {
              if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(currentToken.replace(/^["']|["']$/g, '').trim());
                currentToken = '';
              } else {
                currentToken += char;
              }
            }
            if (currentToken || line.endsWith(',')) {
              values.push(currentToken.replace(/^["']|["']$/g, '').trim());
            }

            const rowObj = {};
            headerRow.forEach((h, idx) => {
              rowObj[h] = values[idx] || '';
            });

            const name = rowObj['name'] || rowObj['full name'] || rowObj['lead name'];
            const email = rowObj['email'] || rowObj['email address'];

            if (!name || !email) {
              errors.push(`Row ${i + 1}: Missing required Name or Email`);
              continue;
            }

            const location_preference = rowObj['location'] || rowObj['location preference'] || null;
            const property_type_preference = rowObj['property type'] || rowObj['property_type'] || null;
            const bhk_preference = parseInt(rowObj['bhk']) || null;
            const budget_max = parseInt(rowObj['budget']) || parseInt(rowObj['budget max']) || null;

            let score = 50;
            if (location_preference) score += 10;
            if (budget_max) score += 20;
            if (bhk_preference || property_type_preference) score += 10;
            if (rowObj['phone'] || email) score += 10;

            const category = score >= 71 ? 'Hot' : score >= 41 ? 'Warm' : 'Cold';

            const newLead = {
              id: Date.now() + i,
              name,
              email,
              phone: rowObj['phone'] || rowObj['phone number'] || '',
              status: rowObj['status'] || 'New',
              location_preference,
              property_type_preference,
              bhk_preference,
              budget_max,
              score,
              category,
              notes: rowObj['notes'] || '',
              created_at: new Date().toISOString()
            };

            importedLeads.push(newLead);
          }

          let local = getLocalLeads() || DEFAULT_INITIAL_LEADS;
          const updated = [...importedLeads, ...local];
          saveLocalLeads(updated);

          resolve({
            success: true,
            imported_count: importedLeads.length,
            errors,
            leads: importedLeads
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  },

  downloadSampleCSVTemplate() {
    const csvContent = "Name,Email,Phone,Status,Location,Property Type,BHK,Budget Max,Notes\n" +
      "Samantha Reed,samantha@nexus.io,+1 555-0199,New,Hyderabad,Villa,4,25000000,Interested in prime location\n" +
      "Gregory House,house@diagnostics.com,+1 555-0143,Contacted,Kondapur,Apartment,3,15000000,Requested amenities list\n" +
      "Clara Oswald,clara@tardis.org,+1 555-0177,Qualified,Gachibowli,Plot,,10000000,Urgent site visit requested\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'salesbot_leads_template.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Analytics API
  async getAnalyticsSummary() {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      if (!res.ok) throw new Error('Failed to fetch analytics summary');
      return await res.json();
    } catch (err) {
      const localLeads = getLocalLeads() || DEFAULT_INITIAL_LEADS;
      const hotCount = localLeads.filter(l => l.category === 'Hot').length;
      const warmCount = localLeads.filter(l => l.category === 'Warm').length;
      const coldCount = localLeads.filter(l => l.category === 'Cold').length;

      return {
        total_leads: localLeads.length,
        hot_leads: hotCount,
        warm_leads: warmCount,
        cold_leads: coldCount,
        conversion_rate: 42.8,
        meetings_scheduled: (getLocalMeetings() || DEFAULT_INITIAL_MEETINGS).length,
        pipeline_value: 145000.0,
        category_distribution: { Hot: hotCount, Warm: warmCount, Cold: coldCount },
        recent_activities: [
          { time: "Just now", action: "Lead Qualified", detail: "Property Inquiry marked as Hot Lead (Score: 88)" },
          { time: "1 hour ago", action: "Site Visit Scheduled", detail: "Tour booked with Prospect for tomorrow at 2 PM" },
          { time: "3 hours ago", action: "AI Chat Qualification", detail: "Automated Property Qualification completed for Nexus Labs" }
        ]
      };
    }
  },

  // Meetings API
  async getMeetings() {
    try {
      const res = await fetch(`${API_BASE}/meetings`);
      if (!res.ok) throw new Error('Failed to fetch meetings');
      const meetings = await res.json();
      if (meetings && meetings.length > 0) {
        saveLocalMeetings(meetings);
      }
      return meetings;
    } catch (err) {
      let local = getLocalMeetings();
      if (!local || local.length === 0) {
        local = DEFAULT_INITIAL_MEETINGS;
        saveLocalMeetings(local);
      }
      return local;
    }
  },

  async getAvailableSlots(targetDateStr, durationMinutes = 30) {
    try {
      const res = await fetch(`${API_BASE}/meetings/available-slots?target_date=${targetDateStr}&duration_minutes=${durationMinutes}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getAvailableSlots unavailable, computing client-side', err);
    }

    const local = getLocalMeetings() || DEFAULT_INITIAL_MEETINGS;
    const slotHours = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    const slots = slotHours.map(sh => {
      const [h, m] = sh.split(':').map(Number);
      const slotDate = new Date(`${targetDateStr}T${sh}:00`);
      const slotStart = slotDate.getTime();
      const slotEnd = slotStart + durationMinutes * 60000;

      let isAvailable = true;
      let conflictTitle = null;
      let conflictLead = null;

      for (const ex of local) {
        if (ex.status === 'Cancelled') continue;
        const exStart = new Date(ex.meeting_date).getTime();
        const exEnd = exStart + (ex.duration_minutes || 30) * 60000;

        if (!isNaN(exStart) && slotStart < exEnd && slotEnd > exStart) {
          isAvailable = false;
          conflictTitle = ex.title;
          conflictLead = ex.lead_name;
          break;
        }
      }

      const time12 = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        time: time12,
        datetime: slotDate.toISOString(),
        available: isAvailable,
        conflict_title: conflictTitle,
        conflict_lead: conflictLead
      };
    });

    return slots;
  },

  async createMeeting(meetingData) {
    try {
      const res = await fetch(`${API_BASE}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      });
      if (res.ok) {
        const createdObj = await res.json();
        let local = getLocalMeetings() || DEFAULT_INITIAL_MEETINGS;
        saveLocalMeetings([createdObj, ...local.filter(m => m.id !== createdObj.id)]);
        return createdObj;
      }
      if (res.status === 409 || res.status === 400) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Time slot conflict: Selected time overlaps with another meeting.');
      }
    } catch (err) {
      if (err.message && (err.message.includes('conflict') || err.message.includes('overlaps'))) {
        throw err;
      }
      console.warn('API connection offline, using client-side meeting creation', err);
    }

    const local = getLocalMeetings() || DEFAULT_INITIAL_MEETINGS;
    const newStart = new Date(meetingData.meeting_date).getTime();
    const newEnd = newStart + (meetingData.duration_minutes || 30) * 60000;

    for (const ex of local) {
      if (ex.status === 'Cancelled') continue;
      const exStart = new Date(ex.meeting_date).getTime();
      const exEnd = exStart + (ex.duration_minutes || 30) * 60000;
      if (!isNaN(exStart) && newStart < exEnd && newEnd > exStart) {
        throw new Error(`Time slot conflict: Meeting overlaps with '${ex.title}' for ${ex.lead_name}.`);
      }
    }

    const createdObj = {
      id: Date.now(),
      ...meetingData,
      created_at: new Date().toISOString()
    };

    saveLocalMeetings([createdObj, ...local.filter(m => m.id !== createdObj.id)]);
    return createdObj;
  },

  async updateMeeting(meetingId, meetingData) {
    try {
      const res = await fetch(`${API_BASE}/meetings/${meetingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      });
      if (res.ok) {
        const updatedObj = await res.json();
        let local = getLocalMeetings() || DEFAULT_INITIAL_MEETINGS;
        saveLocalMeetings(local.map(m => m.id === meetingId ? { ...m, ...updatedObj } : m));
        return updatedObj;
      }
      if (res.status === 409 || res.status === 400) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Time slot conflict: Selected time overlaps with another meeting.');
      }
    } catch (err) {
      if (err.message && (err.message.includes('conflict') || err.message.includes('overlaps'))) {
        throw err;
      }
      console.warn('Meeting update API unavailable, updating client-side', err);
    }

    const local = getLocalMeetings() || DEFAULT_INITIAL_MEETINGS;
    if (meetingData.meeting_date && (meetingData.status || 'Scheduled') !== 'Cancelled') {
      const newStart = new Date(meetingData.meeting_date).getTime();
      const newEnd = newStart + (meetingData.duration_minutes || 30) * 60000;

      for (const ex of local) {
        if (ex.id === meetingId || ex.status === 'Cancelled') continue;
        const exStart = new Date(ex.meeting_date).getTime();
        const exEnd = exStart + (ex.duration_minutes || 30) * 60000;
        if (!isNaN(exStart) && newStart < exEnd && newEnd > exStart) {
          throw new Error(`Time slot conflict: Meeting overlaps with '${ex.title}' for ${ex.lead_name}.`);
        }
      }
    }

    const updatedObj = { id: meetingId, ...meetingData };
    if (local) {
      saveLocalMeetings(local.map(m => m.id === meetingId ? { ...m, ...updatedObj } : m));
    }

    return updatedObj;
  },

  async deleteMeeting(meetingId) {
    try {
      await fetch(`${API_BASE}/meetings/${meetingId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Meeting delete API unavailable, deleting client-side', err);
    }
    let local = getLocalMeetings();
    if (local) {
      saveLocalMeetings(local.filter(m => m.id !== meetingId));
    }
    return true;
  },

  // Properties API
  async getProperties() {
    try {
      const res = await fetch(`${API_BASE}/properties`);
      if (!res.ok) throw new Error('Failed to fetch properties');
      const properties = await res.json();
      if (properties && properties.length > 0) {
        saveLocalProperties(properties);
      }
      return properties;
    } catch (err) {
      console.warn('API connection offline, using client-side property data', err);
      let local = getLocalProperties();
      if (!local || local.length === 0) {
        local = DEFAULT_INITIAL_PROPERTIES;
        saveLocalProperties(local);
      }
      return local;
    }
  },

  async createProperty(propertyData) {
    try {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      if (res.ok) {
        const createdObj = await res.json();
        let local = getLocalProperties() || DEFAULT_INITIAL_PROPERTIES;
        saveLocalProperties([createdObj, ...local]);
        return createdObj;
      }
    } catch (err) {
      console.warn('API connection offline, using client-side property creation', err);
    }
    const createdObj = { id: Date.now(), ...propertyData };
    let local = getLocalProperties() || DEFAULT_INITIAL_PROPERTIES;
    saveLocalProperties([createdObj, ...local]);
    return createdObj;
  },

  async updateProperty(propertyId, propertyData) {
    try {
      const res = await fetch(`${API_BASE}/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      if (res.ok) {
        const updatedObj = await res.json();
        let local = getLocalProperties() || DEFAULT_INITIAL_PROPERTIES;
        saveLocalProperties(local.map(p => p.id === propertyId ? { ...p, ...updatedObj } : p));
        return updatedObj;
      }
    } catch (err) {
      console.warn('API update unavailable, updating client-side', err);
    }
    const updatedObj = { id: propertyId, ...propertyData };
    let local = getLocalProperties() || DEFAULT_INITIAL_PROPERTIES;
    saveLocalProperties(local.map(p => p.id === propertyId ? { ...p, ...updatedObj } : p));
    return updatedObj;
  },

  async deleteProperty(propertyId) {
    try {
      await fetch(`${API_BASE}/properties/${propertyId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete unavailable, deleting client-side', err);
    }
    let local = getLocalProperties() || DEFAULT_INITIAL_PROPERTIES;
    saveLocalProperties(local.filter(p => p.id !== propertyId));
    return true;
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
          "Automatic Entity Extraction (Name, Email, Phone, Budget, Location, BHK)",
          "Automated Real Estate Lead Scoring",
          "Calendar Site Visit Booking",
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
    let score = 50;
    if (qualifyData.location) score += 10;
    if (qualifyData.budget) score += 20;
    if (qualifyData.property_type) score += 10;
    if (qualifyData.phone || qualifyData.email) score += 10;

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
  },

  // Authentication API
  getCurrentUser() {
    try {
      const data = localStorage.getItem('salesbot_auth_user');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const userObj = {
          email,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          role: 'Sales Representative',
          token: data.access_token,
          isLoggedIn: true
        };
        localStorage.setItem('salesbot_auth_user', JSON.stringify(userObj));
        localStorage.setItem('salesbot_auth_token', data.access_token);
        return userObj;
      }
    } catch (err) {
      console.warn('Backend Auth API offline, using smart local fallback authentication', err);
    }

    const mockProfiles = {
      'executive@company.com': { name: 'Alex Morgan', role: 'Senior Sales Lead' },
      'admin@salesbot.ai': { name: 'Sarah Connor', role: 'Sales Director & Admin' },
      'engineer@salesbot.ai': { name: 'David Chen', role: 'Solutions Engineer' }
    };

    const matched = mockProfiles[email.toLowerCase()];
    const userObj = {
      id: Date.now(),
      name: matched ? matched.name : (email ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Sales Rep'),
      email: email || 'executive@company.com',
      role: matched ? matched.role : 'Sales Representative',
      token: `mock_jwt_token_${Date.now()}`,
      isLoggedIn: true
    };

    localStorage.setItem('salesbot_auth_user', JSON.stringify(userObj));
    localStorage.setItem('salesbot_auth_token', userObj.token);
    return userObj;
  },

  async register(name, email, password, role = 'Sales Representative') {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        const userObj = {
          id: data.id || Date.now(),
          name: data.name || name,
          email: data.email || email,
          role: data.role || role,
          token: `jwt_${Date.now()}`,
          isLoggedIn: true
        };
        localStorage.setItem('salesbot_auth_user', JSON.stringify(userObj));
        localStorage.setItem('salesbot_auth_token', userObj.token);
        return userObj;
      }
    } catch (err) {
      console.warn('Backend Auth Register API offline, completing client registration', err);
    }

    const userObj = {
      id: Date.now(),
      name: name || 'New Sales User',
      email: email || 'newuser@company.com',
      role: role || 'Sales Representative',
      token: `mock_jwt_token_${Date.now()}`,
      isLoggedIn: true
    };

    localStorage.setItem('salesbot_auth_user', JSON.stringify(userObj));
    localStorage.setItem('salesbot_auth_token', userObj.token);
    return userObj;
  },

  logout() {
    try {
      localStorage.removeItem('salesbot_auth_user');
      localStorage.removeItem('salesbot_auth_token');
    } catch (e) {}
    return true;
  }
};

export default apiService;
