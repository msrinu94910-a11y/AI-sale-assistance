class LeadQualificationEngine:
    """
    BANT Lead Qualification Scoring Engine
    - Budget: 25%
    - Need: 30%
    - Authority: 20%
    - Timeline: 25%
    Score scale: 0-100
    Categories: 0-40 Cold, 41-70 Warm, 71-100 Hot
    """

    WEIGHTS = {
        "budget": 0.25,
        "need": 0.30,
        "authority": 0.20,
        "timeline": 0.25
    }

    @classmethod
    def calculate_score(cls, budget: int, need: int, authority: int, timeline: int) -> int:
        score = (
            (budget * cls.WEIGHTS["budget"]) +
            (need * cls.WEIGHTS["need"]) +
            (authority * cls.WEIGHTS["authority"]) +
            (timeline * cls.WEIGHTS["timeline"])
        )
        return int(round(score))

    @classmethod
    def classify_lead(cls, score: int) -> str:
        if score >= 71:
            return "Hot"
        elif score >= 41:
            return "Warm"
        else:
            return "Cold"

    @classmethod
    def evaluate_lead(cls, budget: int = 50, need: int = 50, authority: int = 50, timeline: int = 50):
        score = cls.calculate_score(budget, need, authority, timeline)
        category = cls.classify_lead(score)
        return {
            "score": score,
            "category": category,
            "breakdown": {
                "budget": budget,
                "need": need,
                "authority": authority,
                "timeline": timeline
            }
        }
