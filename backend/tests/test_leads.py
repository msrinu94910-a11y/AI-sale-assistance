from app.services.lead_qualification import LeadQualificationEngine

def test_bant_lead_scoring_hot():
    # High budget, need, authority, timeline -> Hot lead (>70)
    res = LeadQualificationEngine.evaluate_lead(budget=90, need=85, authority=80, timeline=95)
    assert res["score"] >= 71
    assert res["category"] == "Hot"

def test_bant_lead_scoring_cold():
    # Low score -> Cold lead (<=40)
    res = LeadQualificationEngine.evaluate_lead(budget=20, need=30, authority=20, timeline=25)
    assert res["score"] <= 40
    assert res["category"] == "Cold"
