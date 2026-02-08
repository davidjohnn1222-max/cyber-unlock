// ================= SOCKET =================
const socket = io();

// ================= ELEMENTS =================
const fp = document.getElementById("fingerprint");
const statusText = document.getElementById("status");
const hum = document.getElementById("hum");

// ================= STATE =================
let timer = null;
let unlocked = false;

// ================= AUDIO =================
document.body.addEventListener(
  "click",
  () => {
    if (!hum) return;
    hum.volume = 0.25;
    hum.play().catch(() => { });
  },
  { once: true }
);

// ================= FINGER SCAN =================
function startScan() {
  if (unlocked) return;

  fp.classList.add("active");
  document.body.classList.add("scanning");

  if (navigator.vibrate) navigator.vibrate(40);

  timer = setTimeout(() => {
    unlocked = true;

    fp.classList.remove("active");
    fp.classList.add("authorized");
    document.body.classList.remove("scanning");

    if (statusText) statusText.style.opacity = 1;

    socket.emit("unlock");

    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  }, 5000); // ⏱ 5 SECONDS
}

function stopScan() {
  if (unlocked) return;

  clearTimeout(timer);
  fp.classList.remove("active");
  document.body.classList.remove("scanning");
}

// ================= EVENTS =================
fp.addEventListener("mousedown", startScan);
fp.addEventListener("touchstart", startScan);

fp.addEventListener("mouseup", stopScan);
fp.addEventListener("mouseleave", stopScan);
fp.addEventListener("touchend", stopScan);

// ================= PARALLAX (DESKTOP) =================
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 18;
  const y = (e.clientY / window.innerHeight - 0.5) * 18;
  document.documentElement.style.setProperty("--px", `${x}px`);
  document.documentElement.style.setProperty("--py", `${y}px`);
});

// ================= PARALLAX (MOBILE) =================
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma === null || e.beta === null) return;

  const x = e.gamma / 3;
  const y = e.beta / 6;

  document.documentElement.style.setProperty("--px", `${x}px`);
  document.documentElement.style.setProperty("--py", `${y}px`);
});
