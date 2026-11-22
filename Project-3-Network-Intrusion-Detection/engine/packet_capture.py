
from scapy.all import sniff, IP
from threading import Thread, Lock
from datetime import datetime


class PacketCapture:
    def __init__(self, detection_engine, alert_callback):
        self.detection_engine = detection_engine
        self.alert_callback = alert_callback

        self.running = False
        self.packet_count = 0
        self.packets = []
        self.lock = Lock()
        self.capture_thread = None

    def process_packet(self, packet):
        if not packet.haslayer(IP):
            return

        current_packet = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "source_ip": packet[IP].src,
            "destination_ip": packet[IP].dst,
            "protocol": packet.sprintf("%IP.proto%"),
            "size": len(packet)
        }

        with self.lock:
            self.packet_count += 1
            self.packets.append(current_packet)
            self.packets = self.packets[-200:]

        alerts = self.detection_engine.analyze_packet(packet)

        for alert in alerts:
            self.alert_callback(alert)

    def start(self):
        if self.running:
            return False

        self.running = True

        self.capture_thread = Thread(
            target=self._capture,
            daemon=True
        )
        self.capture_thread.start()

        return True

    def _capture(self):
        try:
            sniff(
                prn=self.process_packet,
                store=False,
                stop_filter=lambda packet: not self.running
            )
        except Exception as error:
            self.running = False
            print(f"Packet capture error: {error}")

    def stop(self):
        self.running = False

    def get_packets(self):
        with self.lock:
            return list(reversed(self.packets))

    def get_packet_count(self):
        with self.lock:
            return self.packet_count
