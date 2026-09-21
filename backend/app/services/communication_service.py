import json
import uuid
from datetime import datetime
import os
import smtplib
from email.message import EmailMessage
from app.models.lead import Lead
from app.core.config import settings

def _send_smtp_email(to_email: str, subject: str, body: str):
    smtp_server = settings.SMTP_SERVER
    smtp_port = settings.SMTP_PORT
    smtp_user = settings.SMTP_USER
    smtp_pass = settings.SMTP_PASSWORD
    
    if not smtp_user or not smtp_pass:
        print("--- SMTP Credentials Missing! Cannot send email ---")
        return
        
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = f"AI Sales Assistant <{smtp_user}>"
    msg['To'] = to_email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            print(f"--- Successfully sent email to {to_email} via SMTP ---")
    except Exception as e:
        print(f"--- Failed to send email to {to_email}: {e} ---")

class CommunicationService:
    """
    Mock Email/SMS Service for prototyping automated follow-ups.
    In production, replace the print statements with SendGrid / Twilio API calls.
    """

    @classmethod
    def send_follow_up_email(cls, lead: Lead, recommended_action: str):
        if not lead.email or "@unknown.com" in lead.email:
            print(f"--- Email Service Skipped: No valid email for {lead.name} ---")
            return
            
        print("\n" + "="*60)
        print("📩 AUTOMATED EMAIL DISPATCHED")
        print("="*60)
        print(f"To:      {lead.email}")
        print(f"From:    AI Sales Assistant <hello@realestate-ai.com>")
        print(f"Subject: Your Custom Property Recommendations (Score: {lead.score})")
        print("-" * 60)
        
        greeting = f"Hi {lead.name}," if lead.name else "Hello,"
        
        budget_str = f"Up to {lead.budget_max / 10000000} Cr" if (lead.budget_max and lead.budget_max >= 10000000) else (f"Up to {lead.budget_max / 100000} Lakhs" if lead.budget_max else "Flexible")
        
        body = f"""{greeting}

Thank you for chatting with our AI Sales Assistant! 
Based on your preferences, we have curated a selection of properties that match your criteria:

Your Requirements:
- Budget: {budget_str}
- Location: {lead.location_preference or 'Open'}
- Type: {lead.property_type_preference or 'Any'}

Our AI Recommendation: {recommended_action}

One of our senior agents will be in touch shortly to assist you further.

Best regards,
The Real Estate Intelligence Team
"""
        print(body)
        print("="*60 + "\n")
        
        subject = f"Your Custom Property Recommendations (Score: {lead.score})"
        _send_smtp_email(lead.email, subject, body)


    @classmethod
    def send_meeting_confirmation(cls, lead_email: str, lead_name: str, meeting_title: str, meeting_date: datetime):
        if not lead_email or "@unknown.com" in lead_email:
            print(f"--- Email Service Skipped: No valid email for {lead_name} ---")
            return
            
        print("\n" + "="*60)
        print("📅 MEETING CONFIRMATION EMAIL")
        print("="*60)
        print(f"To:      {lead_email}")
        print(f"From:    AI Sales Assistant <hello@realestate-ai.com>")
        print(f"Subject: Booking Confirmed: {meeting_title}")
        print("-" * 60)
        
        greeting = f"Hi {lead_name}," if lead_name else "Hello,"
        
        body = f"""{greeting}

Your meeting has been successfully scheduled!

Details:
- Event: {meeting_title}
- Date & Time: {meeting_date.strftime('%A, %b %d at %I:%M %p')}

We have attached a calendar invite to this email. We look forward to speaking with you!

Best regards,
The Real Estate Intelligence Team
"""
        print(body)
        print("="*60 + "\n")
        
        subject = f"Booking Confirmed: {meeting_title}"
        _send_smtp_email(lead_email, subject, body)
