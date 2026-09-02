from pydantic import BaseModel
from typing import Dict, Any, List

class AnalyticsSummary(BaseModel):
    total_leads: int
    hot_leads: int
    warm_leads: int
    cold_leads: int
    conversion_rate: float
    meetings_scheduled: int
    pipeline_value: float
    category_distribution: Dict[str, int]
    recent_activities: List[Dict[str, Any]]
