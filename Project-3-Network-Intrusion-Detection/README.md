# SentinelNIDS
### Network Intrusion Detection System

<p align="center">
  <strong>A Python-powered network monitoring and rule-based intrusion detection dashboard.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-Web%20Dashboard-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Scapy-Packet%20Analysis-2D8CFF?style=for-the-badge" alt="Scapy">
  <img src="https://img.shields.io/badge/SQLite-Alert%20Storage-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

## Overview

**SentinelNIDS** is a web-based Network Intrusion Detection System built with Python. It monitors network packets, applies configurable-style detection logic to identify suspicious traffic patterns, and presents security events through a dashboard.

The project is designed as a practical cybersecurity learning and portfolio project, bringing together packet capture, traffic inspection, rule-based detection, alert management, and web application development.

## Key Features

- **Live packet monitoring:** Capture and inspect network packets using Scapy.
- **Traffic visibility:** Display source and destination IP addresses, protocol information, packet size, and packet activity.
- **Port scan detection:** Identify a source generating connection attempts across many destination ports within a short time window.
- **SYN burst detection:** Flag unusually high volumes of TCP SYN packets from a source.
- **ICMP burst detection:** Identify unusually frequent ICMP traffic from a source.
- **Severity-based alerts:** Classify detected events by severity, such as Medium, High, and Critical.
- **Persistent alert storage:** Store security events in an SQLite database.
- **Web dashboard:** View packet activity, monitoring status, and security alerts in one interface.
- **Monitoring controls:** Start and stop packet capture from the dashboard.
- **Offline threat simulation:** Generate sample packets locally to exercise detection rules without transmitting attack traffic over the network.

## Detection Scenarios

| Detection rule | What it looks for |
|---|---|
| Port scan | Many unique destination ports contacted by one source in a short time window |
| SYN burst | A high number of TCP SYN packets from one source |
| ICMP burst | A high number of ICMP packets from one source |

Detection thresholds are implemented in the detection engine. These rules identify traffic patterns that may be suspicious; they do not independently prove that an attack has occurred.

## Technology Stack

| Component | Technology |
|---|---|
| Programming language | Python |
| Web framework | Flask |
| Packet capture and inspection | Scapy |
| Windows packet capture support | Npcap |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |

## Application Architecture

1. **Packet capture layer:** Scapy captures packets from the selected network interface.
2. **Processing layer:** The capture module extracts relevant packet information.
3. **Detection layer:** The detection engine evaluates traffic against detection rules.
4. **Alert handling:** Detected events are passed to the application and saved to SQLite.
5. **Presentation layer:** Flask serves the dashboard and API endpoints used by the frontend.

## Project Structure

```text
Project-3-Network-Intrusion-Detection/
│
├── app.py
├── config.py
├── database.py
├── requirements.txt
│
├── engine/
│   ├── __init__.py
│   ├── packet_capture.py
│   └── detection_engine.py
│
├── database/
│   └── alerts.db          # Created when the application runs
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## Installation and Setup

### Prerequisites

- Python 3
- Windows
- Npcap installed for packet capture with Scapy
- Administrator privileges may be required for live packet capture, depending on the system configuration

### 1. Clone the repository

```bash
git clone https://github.com/ratanndeveloper-027/CodeAlpha_Tasks.git
cd CodeAlpha_Tasks/Project-3-Network-Intrusion-Detection
```

### 2. Create and activate a virtual environment

**Windows Command Prompt:**

```cmd
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the application

```bash
python app.py
```

### 5. Open the dashboard

Visit the following address in your browser:

```text
http://127.0.0.1:5000
```

Use the dashboard controls to start or stop monitoring. The offline simulation option can be used to test the detection rules without sending packets onto a network.

## Learning Outcomes

This project provides practical experience with:

- Network packet capture and inspection
- TCP and ICMP traffic fundamentals
- Identifying suspicious network traffic patterns
- Implementing rule-based detection logic
- Building REST-style Flask endpoints
- Displaying live data in a web dashboard
- Persisting security alerts with SQLite
- Organizing and documenting a Python application

## Responsible Use

SentinelNIDS is intended for education, demonstrations, and authorized network monitoring.

**Only monitor networks and devices that you own or have explicit permission to inspect.** Do not use this project to intercept traffic or test systems without authorization.

## Project Information

- **Project:** SentinelNIDS - Network Intrusion Detection System
- **Program:** CodeAlpha Cyber Security Internship
- **Category:** Network Security / Intrusion Detection
- **Repository:** [CodeAlpha_Tasks](https://github.com/ratanndeveloper-027/CodeAlpha_Tasks)

---

<p align="center">
  <em>Built to learn network security through practical implementation.</em>
</p>
