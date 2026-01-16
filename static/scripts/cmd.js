const COLUMN_WIDTH = 20;

const createLine = (text) => `<span>${text}</span>`;
const createPromptLine = (text) => `<span class="cmd-input-span">${text}</span>`;

const formatRow = (col1, col2) => col1.padEnd(COLUMN_WIDTH, '\u00A0') + col2;

const commandResponses = {
    help: () => [
        formatRow("HELP", "See a list of commands"),
        formatRow("CLS", "Clear screen"),
        formatRow("SYSINFO", "See system information"),
        formatRow("COLOR [value]", "Change the CMD text color"),
        formatRow("WHOAMI", "Displays information about the user"),
        formatRow("TREE", "Displays the contents of a directory"),
        formatRow("DATE", "Displays the current date"),
        formatRow("NETSTAT", "Displays active connections"),
        formatRow("AUTOPLAY [value]", "Sets the music autoplay on or off when viewing liminal folders")
    ],
    sysinfo: () => [
        formatRow("Host Name:", "?"),
        formatRow("OS Name:", "Microsoft Windows XP Professional"),
        formatRow("OS Version:", "5.1.2600 Service Pack 0"),
        formatRow("Product ID:", "00000-00000-00000-VOID"),
        formatRow("Processor(s):", "1 Processor(s) Installed."),
        formatRow("", "[01]: x86 Family 6 Model 13 Stepping 6 ~0 MHz"),
        formatRow("Network Card(s):", "1 NIC(s) Installed."),
        formatRow("", "[01]: Connection to 'reality' - Status: Failed"),
    ],
    tree: () => [
        "C:\\",
        "├── DOCUMENTS",
        "│   └── GUEST_000",
        "│       ├── MEMORIES (empty)",
        "│       └── whyamihere.txt",
        "└── WINDOWS",
        "    ├── SYSTEM32",
        "    ├── DRIVERS",
        "    └── KERNEL_VOID.DLL"
    ],
    whoami: () => ["username: you're lost forever"],
    date: () => ["07/04/2006 13:37:00 PM"],
    netstat: () => [
        "Active Internet connections (servers and established)",
        formatRow("Proto", "Local Address").padEnd(45, '\u00A0') + "State",
        formatRow("TCP", "0.0.0.0:135").padEnd(45, '\u00A0') + "TIME_WAIT",
        formatRow("TCP", "0.0.0.0:1337").padEnd(45, '\u00A0') + "TIME_WAIT"
    ]
};

function handleCMDInput() {
    const input = document.getElementById("cmd-input");
    const inputValue = input.value.toLowerCase().trim();
    const cmdContent = document.querySelector(".cmd-content");
    let outputLines = [];

    if (inputValue === "") {
        cmdContent.innerHTML += createPromptLine("C:\\WINDOWS> ");
        return;
    }

    if (inputValue === "cls") {
        cmdContent.innerHTML = "";
        input.value = "";
        return;
    }

    if (inputValue.startsWith("color ")) {
        const color = inputValue.split(" ")[1];
        cmdContent.style.color = color;
        outputLines = [];
    } 

    if (inputValue.startsWith("autoplay ")) {
        const value = inputValue.split(" ")[1];
        var holder = document.getElementById("holder");

        if (value == "on" || value == "true" || value.toString() == "1") {
            holder.setAttribute("autoplay", "on");
        } else if (value == "off" || value == "false" || value.toString() == "0") {
            holder.setAttribute("autoplay", "off");
        }

        outputLines = ["autoplay set to " + holder.getAttribute("autoplay")];
    }

    else if (commandResponses[inputValue]) {
        outputLines = commandResponses[inputValue]();
    }

    else {
        outputLines = [`'${inputValue}' command not found. Use 'help' to see a list of commands.`];
        document.getElementById("exclamation-effect").play();
    }

    let fullHTML = createPromptLine(`C:\\WINDOWS> ${inputValue}`);
    fullHTML += outputLines.map(line => createLine(line)).join("");
    
    cmdContent.innerHTML += fullHTML;
    input.value = "";
    
    cmdContent.scrollTop = cmdContent.scrollHeight;
}

function closeCMD() {
    var cmdContent = document.getElementById("cmd-content");
    cmdContent.innerHTML = "";
}

$(document).ready(function (){
    var cmdBody = document.getElementById("cmd-body");

    $("#cmd-input").on("keyup", function (e) {
        if (e.key === "Enter" || e.keyCode === 13) {
            handleCMDInput();
            cmdBody.scrollTop = cmdBody.scrollHeight - cmdBody.clientHeight;
        }

    });
    
    var cmd_input = document.getElementById("cmd-input");

    document.getElementById("cmd-application-icon").addEventListener("click", () => {
        cmd_input.focus();
    });
    
    document.getElementById("cmd-body").addEventListener("click", () => {
        cmd_input.focus();
    });
});
