import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.property import Property
from app.models.lead import Lead
from app.models.conversation import Conversation
from app.models.meeting import Meeting

def seed_db():
    print("Dropping old tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating new tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        properties = [
            Property(
                name="Green Valley Villas",
                description="Luxury 4 BHK villas with private garden and pool.",
                location="Gachibowli",
                property_type="Villa",
                bhk=4,
                price=25000000, # 2.5 Cr
                area="4000 sqft",
                amenities="Pool, Gym, Garden, 24/7 Security"
            ),
            Property(
                name="Urban Nest",
                description="Modern 3 BHK apartments in the heart of the city.",
                location="Kondapur",
                property_type="Apartment",
                bhk=3,
                price=12000000, # 1.2 Cr
                area="1800 sqft",
                amenities="Clubhouse, Park, Power Backup"
            ),
            Property(
                name="Lakeview Residences",
                description="Spacious 3 BHK apartments with lake view.",
                location="Kondapur",
                property_type="Apartment",
                bhk=3,
                price=14000000, # 1.4 Cr
                area="2000 sqft",
                amenities="Lake View, Gym, Jogging Track"
            ),
            Property(
                name="Sunset Plots",
                description="Premium villa plots for custom homes.",
                location="Narsingi",
                property_type="Plot",
                bhk=None,
                price=8000000, # 80 Lakhs
                area="300 sq yds",
                amenities="Gated Community, Water, Electricity"
            ),
            Property(
                name="Elite Towers",
                description="High-rise luxury 2 BHK apartments.",
                location="Madhapur",
                property_type="Apartment",
                bhk=2,
                price=9500000, # 95 Lakhs
                area="1200 sqft",
                amenities="Infinity Pool, Smart Home, Concierge"
            ),
        ]
        
        db.add_all(properties)
        db.commit()
        print(f"Successfully seeded {len(properties)} properties!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
