
from collections import defaultdict, deque
from time import time


class DetectionEngine:
    def __init__(self):
        self.connections = defaultdict(deque)
        self.syn_requests = defaultdict(deque)
        self.icmp_requests = defaultdict(deque)
        self.alert_history = set()

    def analyze_packet(self, packet):
        alerts = []
        current_time = time()

        if not packet.haslayer("IP"):
            return alerts

        source_ip = packet["IP"].src
        destination_ip = packet["IP"].dst

        # Port scan detection
        if packet.haslayer("TCP"):
            destination_port = packet["TCP"].dport

            self.connections[source_ip].append(
                (current_time, destination_port)
            )

            self.connections[source_ip] = deque(
                (timestamp, port)
                for timestamp, port in self.connections[source_ip]
                if current_time - timestamp <= 10
            )

            unique_ports = {
                port for _, port in self.connections[source_ip]
            }

            if len(unique_ports) >= 20:
                alert_key = ("PORT_SCAN", source_ip)

                if alert_key not in self.alert_history:
                    alerts.append({
                        "type": "Port Scan",
                        "source_ip": source_ip,
                        "destination_ip": destination_ip,
                        "severity": "HIGH",
                        "description": (
                            f"Traffic to {len(unique_ports)} "
                            "different ports within 10 seconds"
                        )
                    })
                    self.alert_history.add(alert_key)

            # SYN flood indicator
            if packet["TCP"].flags & 0x02:
                self.syn_requests[source_ip].append(current_time)

                while (
                    self.syn_requests[source_ip]
                    and current_time - self.syn_requests[source_ip][0] > 10
                ):
                    self.syn_requests[source_ip].popleft()

                if len(self.syn_requests[source_ip]) >= 100:
                    alert_key = ("SYN_BURST", source_ip)

                    if alert_key not in self.alert_history:
                        alerts.append({
                            "type": "SYN Burst",
                            "source_ip": source_ip,
                            "destination_ip": destination_ip,
                            "severity": "CRITICAL",
                            "description": (
                                "100 or more SYN packets detected "
                                "within 10 seconds"
                            )
                        })
                        self.alert_history.add(alert_key)

        # ICMP burst detection
        if packet.haslayer("ICMP"):
            self.icmp_requests[source_ip].append(current_time)

            while (
                self.icmp_requests[source_ip]
                and current_time - self.icmp_requests[source_ip][0] > 10
            ):
                self.icmp_requests[source_ip].popleft()

            if len(self.icmp_requests[source_ip]) >= 30:
                alert_key = ("ICMP_BURST", source_ip)

                if alert_key not in self.alert_history:
                    alerts.append({
                        "type": "ICMP Burst",
                        "source_ip": source_ip,
                        "destination_ip": destination_ip,
                        "severity": "MEDIUM",
                        "description": (
                            "30 or more ICMP packets detected "
                            "within 10 seconds"
                        )
                    })
                    self.alert_history.add(alert_key)

        return alerts
