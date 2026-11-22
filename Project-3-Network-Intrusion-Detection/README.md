

\# SentinelNIDS



SentinelNIDS is a Python-based Network Intrusion Detection System with a web-based security monitoring dashboard.



\## Features



\- Live network packet monitoring

\- TCP and ICMP traffic inspection

\- Port scan activity detection

\- SYN burst detection

\- ICMP burst detection

\- Security alerts with severity levels

\- SQLite alert storage

\- Real-time web dashboard

\- Start and stop packet monitoring



\## Technology Stack



\- Python

\- Flask

\- Scapy

\- SQLite

\- HTML

\- CSS

\- JavaScript

\- Npcap



\## Project Structure



```text

Project-3-Network-Intrusion-Detection/

├── app.py

├── config.py

├── database.py

├── requirements.txt

├── engine/

│   ├── \_\_init\_\_.py

│   ├── packet\_capture.py

│   └── detection\_engine.py

├── database/

├── templates/

│   └── index.html

└── static/

&#x20;   ├── style.css

&#x20;   └── script.js

```



\## Installation



```bash

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

```



Npcap must be installed on Windows for Scapy packet capture.



\## Run



Open Command Prompt as Administrator:



```bash

venv\\Scripts\\activate

python app.py

```



Open the dashboard:



http://127.0.0.1:5000



\## Security Note



Use packet monitoring only on networks and devices you own or have explicit permission to monitor.



Detection rules identify suspicious traffic patterns. They do not independently confirm malicious activity.



\## Project



Developed as a cybersecurity learning and portfolio project.



