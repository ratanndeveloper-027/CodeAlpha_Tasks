
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_PATH = os.path.join(
    BASE_DIR, "database", "alerts.db"
)

HOST = "127.0.0.1"
PORT = 5000
DEBUG = True

MAX_PACKETS = 200
MAX_ALERTS = 100

# Detection thresholds
PORT_SCAN_THRESHOLD = 20
SYN_BURST_THRESHOLD = 100
ICMP_BURST_THRESHOLD = 30

CAPTURE_INTERFACE = None
