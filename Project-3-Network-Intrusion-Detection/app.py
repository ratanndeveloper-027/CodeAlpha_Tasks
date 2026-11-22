
from flask import Flask, jsonify, render_template
from threading import Lock

from scapy.all import IP, TCP, ICMP

from config import HOST, PORT, DEBUG
from database import initialize_database, save_alert, get_alerts
from engine.detection_engine import DetectionEngine
from engine.packet_capture import PacketCapture

app = Flask(__name__)

initialize_database()

detection_engine = DetectionEngine()
alert_lock = Lock()


def handle_alert(alert):
    with alert_lock:
        save_alert(alert)


packet_capture = PacketCapture(
    detection_engine=detection_engine,
    alert_callback=handle_alert
)


@app.route("/")
def dashboard():
    return render_template("index.html")


@app.route("/api/start", methods=["POST"])
def start_capture():
    started = packet_capture.start()

    return jsonify({
        "success": started,
        "message": "Packet capture started" if started
        else "Capture is already running"
    })


@app.route("/api/stop", methods=["POST"])
def stop_capture():
    packet_capture.stop()

    return jsonify({
        "success": True,
        "message": "Packet capture stopped"
    })


@app.route("/api/status")
def get_status():
    return jsonify({
        "running": packet_capture.running,
        "packet_count": packet_capture.get_packet_count()
    })


@app.route("/api/packets")
def get_packets():
    return jsonify(packet_capture.get_packets())


@app.route("/api/alerts")
def alerts():
    return jsonify(get_alerts())


# SAFE OFFLINE THREAT SIMULATION
@app.route("/api/simulate", methods=["POST"])
def simulate_threats():

    # Simulated port scan: 20 different destination ports
    for port in range(1, 21):
        packet = (
            IP(src="198.51.100.10", dst="192.0.2.10")
            / TCP(dport=port, sport=45000, flags="S")
        )
        packet_capture.process_packet(packet)

    # Simulated SYN burst: 100 SYN packets
    for _ in range(100):
        packet = (
            IP(src="198.51.100.11", dst="192.0.2.10")
            / TCP(dport=80, sport=45001, flags="S")
        )
        packet_capture.process_packet(packet)

    # Simulated ICMP burst: 30 ICMP packets
    for _ in range(30):
        packet = (
            IP(src="198.51.100.12", dst="192.0.2.10")
            / ICMP()
        )
        packet_capture.process_packet(packet)

    return jsonify({
        "success": True,
        "message": "Offline threat simulation completed",
        "tests": [
            "Port Scan",
            "SYN Burst",
            "ICMP Burst"
        ]
    })


if __name__ == "__main__":
    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG,
        use_reloader=False
    )
