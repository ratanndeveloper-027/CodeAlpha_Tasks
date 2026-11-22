
from flask import Flask, render_template, jsonify
from scapy.all import sniff, IP, TCP, UDP, ICMP
from threading import Thread, Lock
from datetime import datetime

app = Flask(__name__)

packets = []
packet_lock = Lock()
capturing = False
capture_thread = None

def packet_callback(packet):
    if IP not in packet:
        return

    source = packet[IP].src
    destination = packet[IP].dst
    size = len(packet)

    if TCP in packet:
        protocol = "TCP"
        source_port = packet[TCP].sport
        destination_port = packet[TCP].dport
    elif UDP in packet:
        protocol = "UDP"
        source_port = packet[UDP].sport
        destination_port = packet[UDP].dport
    elif ICMP in packet:
        protocol = "ICMP"
        source_port = "-"
        destination_port = "-"
    else:
        protocol = "Other"
        source_port = "-"
        destination_port = "-"

    data = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "source": source,
        "destination": destination,
        "protocol": protocol,
        "source_port": source_port,
        "destination_port": destination_port,
        "size": size
    }

    with packet_lock:
        packets.insert(0, data)
        del packets[100:]

def capture_packets():
    global capturing
    try:
        sniff(prn=packet_callback, store=False, stop_filter=lambda p: not capturing)
    finally:
        capturing = False

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/start")
def start_capture():
    global capturing, capture_thread

    if not capturing:
        capturing = True
        capture_thread = Thread(target=capture_packets, daemon=True)
        capture_thread.start()

    return jsonify({"status": "Capture started"})

@app.route("/stop")
def stop_capture():
    global capturing
    capturing = False
    return jsonify({"status": "Capture stopping"})

@app.route("/packets")
def get_packets():
    with packet_lock:
        return jsonify(list(packets))

@app.route("/clear")
def clear_packets():
    with packet_lock:
        packets.clear()
    return jsonify({"status": "Packets cleared"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
