
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const packetCount = document.getElementById("packetCount");
const alertCount = document.getElementById("alertCount");
const criticalCount = document.getElementById("criticalCount");
const systemState = document.getElementById("systemState");

const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");

const packetTable = document.getElementById("packetTable");
const alertTable = document.getElementById("alertTable");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    return response.json();
}

function updateStatus(running) {
    statusText.textContent = running ? "MONITORING ACTIVE" : "SYSTEM IDLE";
    systemState.textContent = running ? "ACTIVE" : "IDLE";

    statusDot.style.background = running ? "#20d68a" : "#8995a5";

    startBtn.disabled = running;
    stopBtn.disabled = !running;
}

async function startMonitoring() {
    try {
        const result = await apiRequest("/api/start", {
            method: "POST"
        });

        if (!result.success) {
            console.log(result.message);
        }

        await refreshDashboard();
    } catch (error) {
        alert("Unable to start monitoring: " + error.message);
    }
}

async function stopMonitoring() {
    try {
        await apiRequest("/api/stop", {
            method: "POST"
        });

        await refreshDashboard();
    } catch (error) {
        alert("Unable to stop monitoring: " + error.message);
    }
}

function renderPackets(packets) {
    if (!packets.length) {
        packetTable.innerHTML = `
            <tr><td colspan="5" class="empty-state">
                No packets captured yet.
            </td></tr>`;
        return;
    }

    packetTable.innerHTML = packets.map(packet => `
        <tr>
            <td>${escapeHTML(packet.timestamp)}</td>
            <td>${escapeHTML(packet.source_ip)}</td>
            <td>${escapeHTML(packet.destination_ip)}</td>
            <td>${escapeHTML(packet.protocol)}</td>
            <td>${escapeHTML(packet.size)} bytes</td>
        </tr>
    `).join("");
}

function renderAlerts(alerts) {
    if (!alerts.length) {
        alertTable.innerHTML = `
            <tr><td colspan="5" class="empty-state">
                No security alerts detected.
            </td></tr>`;
        return;
    }

    alertTable.innerHTML = alerts.map(alert => `
        <tr>
            <td>${escapeHTML(alert.timestamp)}</td>
            <td>${escapeHTML(alert.alert_type)}</td>
            <td>${escapeHTML(alert.source_ip)}</td>
            <td>
                <span class="severity severity-${escapeHTML(alert.severity)}">
                    ${escapeHTML(alert.severity)}
                </span>
            </td>
            <td>${escapeHTML(alert.description)}</td>
        </tr>
    `).join("");
}

async function refreshDashboard() {
    try {
        const [status, packets, alerts] = await Promise.all([
            apiRequest("/api/status"),
            apiRequest("/api/packets"),
            apiRequest("/api/alerts")
        ]);

        updateStatus(status.running);

        packetCount.textContent = status.packet_count;
        alertCount.textContent = alerts.length;

        const priorityAlerts = alerts.filter(alert =>
            ["HIGH", "CRITICAL"].includes(alert.severity)
        );

        criticalCount.textContent = priorityAlerts.length;

        renderPackets(packets);
        renderAlerts(alerts);

    } catch (error) {
        console.error("Dashboard update failed:", error);
        statusText.textContent = "SERVER CONNECTION ERROR";
    }
}

startBtn.addEventListener("click", startMonitoring);
stopBtn.addEventListener("click", stopMonitoring);

refreshDashboard();
setInterval(refreshDashboard, 2000);
document.getElementById("testBtn").addEventListener("click", async () => {
    const button = document.getElementById("testBtn");

    try {
        button.disabled = true;
        button.textContent = "Simulating...";

        const result = await apiRequest("/api/simulate", {
            method: "POST"
        });

        alert(result.message);
        await refreshDashboard();

    } catch (error) {
        alert("Simulation failed: " + error.message);
    } finally {
        button.disabled = false;
        button.textContent = "🧪 Simulate Threats";
    }
});

// Sidebar Navigation - Active State & ScrollSpy
const navItems = document.querySelectorAll(".nav-item");
const sections = [
    document.getElementById("dashboard"),
    document.getElementById("traffic"),
    document.getElementById("alerts")
].filter(Boolean);

let isClickScrolling = false;

navItems.forEach(item => {
    item.addEventListener("click", function () {
        navItems.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");

        isClickScrolling = true;
        setTimeout(() => {
            isClickScrolling = false;
        }, 800);
    });
});

window.addEventListener("scroll", () => {
    if (isClickScrolling) return;

    let current = "";
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPos + windowHeight >= documentHeight - 50) {
        current = "alerts";
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollPos >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
    }

    if (current) {
        navItems.forEach(item => {
            item.classList.toggle("active", item.getAttribute("href") === `#${current}`);
        });
    }
});
