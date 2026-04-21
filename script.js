const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

const capDashboard = document.querySelector("[data-cap-dashboard]");

if (capDashboard) {
  const budget = 22000000;
  const sliders = [...capDashboard.querySelectorAll("[data-tier-slider]")];
  const totalNode = capDashboard.querySelector("[data-total]");
  const remainingNode = capDashboard.querySelector("[data-remaining]");
  const statusNode = capDashboard.querySelector("[data-status]");
  const pie = capDashboard.querySelector("[data-cap-pie]");

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);

  const render = () => {
    const values = sliders.map((slider) => Number(slider.value) * 1000000);
    const total = values.reduce((sum, value) => sum + value, 0);
    const remaining = budget - total;

    sliders.forEach((slider, index) => {
      const card = slider.closest(".slider-card");
      const amountNode = card.querySelector("[data-tier-amount]");
      const percentNode = card.querySelector("[data-tier-percent]");
      const percent = total > 0 ? Math.round((values[index] / total) * 100) : 0;
      amountNode.textContent = formatMoney(values[index]);
      percentNode.textContent = `${percent}% of allocated budget`;
    });

    totalNode.textContent = formatMoney(total);
    remainingNode.textContent = formatMoney(Math.abs(remaining));

    if (remaining >= 0) {
      statusNode.textContent = `${formatMoney(remaining)} remaining under the internal cap`;
      statusNode.className = "status-ok";
    } else {
      statusNode.textContent = `${formatMoney(Math.abs(remaining))} over the internal cap`;
      statusNode.className = "status-over";
    }

    if (pie) {
      const colors = ["#10b981", "#38bdf8", "#f59e0b", "#ef4444"];
      let cursor = 0;
      const safeTotal = total || 1;
      const stops = values.map((value, index) => {
        const start = cursor;
        cursor += (value / safeTotal) * 100;
        return `${colors[index]} ${start}% ${cursor}%`;
      });
      pie.style.background = `conic-gradient(${stops.join(", ")})`;
    }
  };

  sliders.forEach((slider) => slider.addEventListener("input", render));
  render();
}
