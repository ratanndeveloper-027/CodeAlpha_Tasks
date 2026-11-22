
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");

const packetTable = document.getElementById("packetTable");

let refreshInterval = null;

startBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/start");
        const result = await response.json();

        alert(result.status);

        if (!refreshInterval) {
            refreshInterval = setInterval(loadPackets, 1000);
        }
    } catch (error) {
        alert("Unable to start packet capture.");
    }
});

stopBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/stop");
        const result = await response.json();

        alert(result.status);

        clearInterval(refreshInterval);
        refreshInterval = null;
    } catch (error) {
        alert("Unable to stop packet capture.");
    }
});

clearBtn.addEventListener("click", async () => {
    await fetch("/clear");
    loadPackets();
});

async function loadPackets() {
    try {
        const response = await fetch("/packets");
        const packets = await response.json();

        document.getElementById("totalPackets").textContent = packets.length;

        document.getElementById("tcpPackets").textContent =
            packets.filter(p => p.protocol === "TCP").length;

        document.getElementById("udpPackets").textContent =
            packets.filter(p => p.protocol === "UDP").length;

        document.getElementById("icmpPackets").textContent =
            packets.filter(p => p.protocol === "ICMP").length;

        if (packets.length === 0) {
            packetTable.innerHTML =
                '<tr><td colspan="7" class="empty">No packets captured yet.</td></tr>';
            return;
        }

        packetTable.innerHTML = packets.map(packet => `
            <tr>
                <td>${packet.time}</td>
                <td>${packet.source}</td>
                <td>${packet.destination}</td>
                <td>${packet.protocol}</td>
                <td>${packet.source_port}</td>
                <td>${packet.destination_port}</td>
                <td>${packet.size} bytes</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Packet loading error:", error);
    }
}
