
import sqlite3
from datetime import datetime

DB_PATH = "database/alerts.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            source_ip TEXT,
            destination_ip TEXT,
            severity TEXT NOT NULL,
            description TEXT
        )
    """)

    connection.commit()
    connection.close()


def save_alert(alert):
    connection = get_connection()

    connection.execute("""
        INSERT INTO alerts (
            timestamp,
            alert_type,
            source_ip,
            destination_ip,
            severity,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        alert.get("type"),
        alert.get("source_ip"),
        alert.get("destination_ip"),
        alert.get("severity"),
        alert.get("description")
    ))

    connection.commit()
    connection.close()


def get_alerts(limit=100):
    connection = get_connection()

    rows = connection.execute("""
        SELECT * FROM alerts
        ORDER BY id DESC
        LIMIT ?
    """, (limit,)).fetchall()

    connection.close()

    return [dict(row) for row in rows]
