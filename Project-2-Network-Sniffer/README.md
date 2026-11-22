# NetSniffer - Basic Network Sniffer

## Project Overview
NetSniffer is a Python-based network monitoring tool that captures and displays live network packets through a web dashboard.

## Features
- Live network packet capturing
- Source and Destination IP detection
- TCP, UDP and ICMP protocol identification
- Source and Destination port detection
- Packet size monitoring
- Real-time web dashboard
- Start, Stop and Clear controls

## Technologies Used
- Python
- Scapy
- Flask
- HTML
- CSS
- JavaScript
- Npcap

## Project Structure
```text
Project-2-Network-Sniffer/
│
├── app.py
├── sniffer.py
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## Installation

Install the required libraries:

```bash
python -m pip install flask scapy
```

Install Npcap on Windows.

## How to Run

1. Open Command Prompt as Administrator.
2. Navigate to the project folder.
3. Run:

```bash
python app.py
```

4. Open your browser and visit:

```text
http://127.0.0.1:5000
```

5. Click Start Capture to monitor network packets.

## Security Notice
Use this tool only on networks and devices you own or have explicit permission to monitor.

## Author
Developed as part of the CodeAlpha Cyber Security Internship.