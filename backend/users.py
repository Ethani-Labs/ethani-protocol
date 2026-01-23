"""
ETHANI User Management Module - SQLite-backed user storage

Handles:
- User registration with phone, email, name, national ID, location, role
- User login and retrieval
- Role-based queries
- Phone-based deduplication
"""

import sqlite3
import os
import hashlib
from typing import Optional, List, Dict
from pathlib import Path

DB_PATH = Path(__file__).parent / "ethani_users.db"


def init_db():
    """Initialize SQLite database if it doesn't exist"""
    if DB_PATH.exists():
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        name TEXT NOT NULL,
        national_id TEXT,
        location TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        points INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1
    )
    """)
    
    # Supply reports table (for farmers)
    cursor.execute("""
    CREATE TABLE supply_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        region TEXT NOT NULL,
        food_category TEXT NOT NULL,
        supply_units INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    
    # Waste tracking table (for circular economy participants)
    cursor.execute("""
    CREATE TABLE waste_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        waste_type TEXT NOT NULL,
        quantity_kg REAL NOT NULL,
        processing_method TEXT,
        energy_credits REAL DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    
    # Delivery orders (for distributors)
    cursor.execute("""
    CREATE TABLE deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        distributor_id INTEGER NOT NULL,
        origin_location TEXT NOT NULL,
        destination_location TEXT NOT NULL,
        food_category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        completed_at TIMESTAMP,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (distributor_id) REFERENCES users(id)
    )
    """)
    
    conn.commit()
    conn.close()


def register_user(
    phone: str,
    name: str,
    email: Optional[str],
    national_id: Optional[str],
    location: str,
    role: str
) -> Dict:
    """
    Register a new user
    
    Args:
        phone: Phone number (unique identifier)
        name: Full name
        email: Email (optional)
        national_id: National ID / KTP (optional)
        location: Region/location name
        role: User role (farmer, livestock_farmer, distributor, buyer, investor, circular_economy, learner)
    
    Returns:
        User record with id
    """
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Insert user
        cursor.execute("""
        INSERT INTO users (phone, name, email, national_id, location, role)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (phone, name, email, national_id, location, role))
        
        user_id = cursor.lastrowid
        conn.commit()
        
        # Fetch and return user record
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = dict(cursor.fetchone())
        
        conn.close()
        
        return {
            "success": True,
            "user": user,
            "message": f"User {name} registered successfully as {role}"
        }
    
    except sqlite3.IntegrityError:
        return {
            "success": False,
            "message": "Phone number already registered"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Registration error: {str(e)}"
        }


def get_user_by_phone(phone: str) -> Optional[Dict]:
    """Get user by phone number"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE phone = ? AND is_active = 1", (phone,))
    user = cursor.fetchone()
    conn.close()
    
    return dict(user) if user else None


def get_user_by_id(user_id: int) -> Optional[Dict]:
    """Get user by ID"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ? AND is_active = 1", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    return dict(user) if user else None


def get_users_by_role(role: str) -> List[Dict]:
    """Get all users with a specific role"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE role = ? AND is_active = 1", (role,))
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return users


def get_users_by_location(location: str) -> List[Dict]:
    """Get all users in a specific location"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE location = ? AND is_active = 1", (location,))
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return users


def add_points(user_id: int, points: int, reason: str) -> Dict:
    """Award points to a user"""
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        UPDATE users SET points = points + ? WHERE id = ?
        """, (points, user_id))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": f"Awarded {points} points for {reason}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error awarding points: {str(e)}"
        }


def record_supply(user_id: int, region: str, food_category: str, supply_units: int) -> Dict:
    """Record supply report from farmer"""
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        INSERT INTO supply_reports (user_id, region, food_category, supply_units)
        VALUES (?, ?, ?, ?)
        """, (user_id, region, food_category, supply_units))
        
        conn.commit()
        conn.close()
        
        # Award points
        add_points(user_id, 10, "supply_report")
        
        return {
            "success": True,
            "message": "Supply recorded and points awarded"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error recording supply: {str(e)}"
        }


def get_supply_by_user(user_id: int) -> List[Dict]:
    """Get all supply reports from a user"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT * FROM supply_reports WHERE user_id = ? ORDER BY timestamp DESC
    """, (user_id,))
    
    reports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return reports


def get_supply_by_region(region: str) -> List[Dict]:
    """Get all supply reports from a region"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT sr.*, u.name as farmer_name
    FROM supply_reports sr
    JOIN users u ON sr.user_id = u.id
    WHERE sr.region = ?
    ORDER BY sr.timestamp DESC
    """, (region,))
    
    reports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return reports


def record_waste(user_id: int, waste_type: str, quantity_kg: float, processing_method: str) -> Dict:
    """Record waste processing (for circular economy participants)"""
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Simple energy credit calculation
        energy_credits = quantity_kg * 0.5  # 0.5 credits per kg
        
        cursor.execute("""
        INSERT INTO waste_tracking (user_id, waste_type, quantity_kg, processing_method, energy_credits)
        VALUES (?, ?, ?, ?, ?)
        """, (user_id, waste_type, quantity_kg, processing_method, energy_credits))
        
        conn.commit()
        conn.close()
        
        # Award points
        add_points(user_id, 20, "waste_processed")
        
        return {
            "success": True,
            "energy_credits": energy_credits,
            "message": f"Waste recorded: {energy_credits} energy credits earned"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error recording waste: {str(e)}"
        }


def get_waste_by_user(user_id: int) -> List[Dict]:
    """Get waste records for a user"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT * FROM waste_tracking WHERE user_id = ? ORDER BY timestamp DESC
    """, (user_id,))
    
    records = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return records


def create_delivery(
    distributor_id: int,
    origin: str,
    destination: str,
    food_category: str,
    quantity: int
) -> Dict:
    """Create a delivery order (distributor)"""
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        INSERT INTO deliveries (distributor_id, origin_location, destination_location, food_category, quantity)
        VALUES (?, ?, ?, ?, ?)
        """, (distributor_id, origin, destination, food_category, quantity))
        
        delivery_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "delivery_id": delivery_id,
            "message": "Delivery order created"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error creating delivery: {str(e)}"
        }


def complete_delivery(delivery_id: int) -> Dict:
    """Mark a delivery as complete"""
    init_db()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
        UPDATE deliveries SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?
        """, (delivery_id,))
        
        # Get distributor ID to award points
        cursor.execute("SELECT distributor_id FROM deliveries WHERE id = ?", (delivery_id,))
        result = cursor.fetchone()
        distributor_id = result[0] if result else None
        
        conn.commit()
        conn.close()
        
        if distributor_id:
            add_points(distributor_id, 15, "delivery_complete")
        
        return {
            "success": True,
            "message": "Delivery marked complete and points awarded"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error completing delivery: {str(e)}"
        }


def get_deliveries_by_status(status: str) -> List[Dict]:
    """Get all deliveries with a specific status"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT d.*, u.name as distributor_name
    FROM deliveries d
    JOIN users u ON d.distributor_id = u.id
    WHERE d.status = ?
    ORDER BY d.timestamp DESC
    """, (status,))
    
    deliveries = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return deliveries


def get_regional_metrics(region: str) -> Dict:
    """Get aggregated supply-demand metrics for a region"""
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Count farmers in region
    cursor.execute("""
    SELECT COUNT(DISTINCT user_id) as farmer_count
    FROM supply_reports
    WHERE region = ?
    """, (region,))
    farmer_count = cursor.fetchone()['farmer_count'] or 0
    
    # Get recent supply-demand ratio
    cursor.execute("""
    SELECT food_category, SUM(supply_units) as total_supply
    FROM supply_reports
    WHERE region = ? AND timestamp > datetime('now', '-7 days')
    GROUP BY food_category
    """, (region,))
    
    supplies = {row['food_category']: row['total_supply'] for row in cursor.fetchall()}
    
    conn.close()
    
    return {
        "region": region,
        "farmer_count": farmer_count,
        "supplies_by_category": supplies
    }
