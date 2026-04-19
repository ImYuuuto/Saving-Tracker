import { Saving, Goal, JsonFiles } from "./data.js";

let goalsData = [];
let moneyTrackingData = [];
let compeletedGoals = [];
const monthlySavings = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 0 },
  { month: "Mar", amount: 0 },
  { month: "Apr", amount: 0 },
  { month: "May", amount: 0 },
  { month: "Jun", amount: 0 },
  { month: "Jul", amount: 0 },
  { month: "Aug", amount: 0 },
  { month: "Sep", amount: 0 },
  { month: "Oct", amount: 0 },
  { month: "Nov", amount: 0 },
  { month: "Dec", amount: 0 },
];

const newGoalForm = document.querySelector("#newGoalForm");
const addSavingsForm = document.querySelector("#addSavingsForm");
const goalErrorText = document.querySelector("#goalErrorText");
const savingsErrorText = document.querySelector("#savingsErrorText");
const goalTitle = document.querySelector("#goalTitle");
const moneyGoal = document.querySelector("#moneyGoal");
const savingsAmount = document.querySelector("#savingsAmount");
const yourGoals = document.querySelector("#yourGoals");
const totalSavings = document.querySelector("#totalSavings");
const activeGoals = document.querySelector("#activeGoals");
const goalsCompl = document.querySelector("#goalsCompl");
const yourGoalsCompl = document.querySelector("#yourGoalsCompl");
const bars = document.querySelectorAll(".bar");
const exportBtn = document.querySelector("#exportBtn");
const fileInput = document.getElementById("fileInput");

moneyGoal.addEventListener("input", () => {
  goalErrorText.classList.add("hidden");
});

// add goal form

newGoalForm.onsubmit = (e) => {
  e.preventDefault();

  if (moneyGoal.value.trim() === "" || goalTitle.value.trim() === "") {
    return;
  }

  if (parseFloat(moneyGoal.value) <= 0) {
    goalErrorText.classList.remove("hidden");
    return;
  }

  goalsData.push(new Goal(goalTitle.value.toUpperCase(), moneyGoal.value));
  renderPage();
  goalTitle.value = "";
  moneyGoal.value = "";
};

savingsAmount.addEventListener("input", () => {
  savingsErrorText.classList.add("hidden");
});

// add savings form

addSavingsForm.onsubmit = (e) => {
  e.preventDefault();
  const sAmount = parseFloat(savingsAmount.value.trim());
  if (isNaN(sAmount)) {
    return;
  }

  if (sAmount <= 0) {
    savingsErrorText.classList.remove("hidden");
    return;
  }
  const month = new Date().getMonth();
  moneyTrackingData.push(new Saving(sAmount, month));

  monthlySavings[month].amount += sAmount;

  renderPage();
  savingsAmount.value = "";
};

function totalSavingsCalc() {
  return moneyTrackingData.reduce((acc, el) => {
    return acc + el.amount;
  }, 0);
}
function GoalsCompletedCalc() {
  return compeletedGoals.reduce((acc, el) => {
    return acc + el.amount;
  }, 0);
}

function renderGoals() {
  const totalSavings = totalSavingsCalc() - GoalsCompletedCalc();
  yourGoals.innerHTML = "";
  yourGoalsCompl.innerHTML = "";
  goalsData.forEach((el) => {
    let color =
      Math.min((totalSavings * 100) / el.amount, 100) < 100
        ? "yellow"
        : "green";
    let complete =
      Math.min((totalSavings * 100) / el.amount, 100) < 100
        ? " to complete."
        : "Completed.";
    yourGoals.innerHTML += `<div class='col-4 cards my-3 text-white'>
     <h3>${el.title}</h3>
     <p style='color:${color};font-size:25px'>${totalSavings > 0 ? Math.min((totalSavings * 100) / el.amount, 100).toFixed(2) : 0}% ${complete}</p>
     <p style='color:${color};font-size:35px'>${el.amount}$</p>
     <button class='btn btn-warning complete-btn' data-title='${el.title}'>Bought it</button>
     </div>`;
  });
  compeletedGoals.forEach((el) => {
    yourGoalsCompl.innerHTML += `<div class='col-4 cards my-3 text-white'>
     <h3 style='color:#06402B'>${el.title}</h3>
     <p style='color:#06402B;font-size:25px'>${totalSavings > 0 ? Math.min((totalSavings * 100) / el.amount, 100).toFixed(2) : 0}%  Completed.</p>
     <p style='color:#06402B;font-size:35px'>${el.amount}$</p>
     </div>`;
  });
}
document.addEventListener("click", (e) => {
  if (e.target.matches(".complete-btn")) {
    goalCompleted(e.target);
  }
  renderPage();
});
function goalCompleted(button) {
  const dataIndex = button.getAttribute("data-title");
  const data = goalsData.find((el) => dataIndex === el.title);
  if (!data) return;
  goalsData = goalsData.filter((el) => el !== data);
  compeletedGoals.push(data);
  renderPage();
}
function renderMonths() {
  bars.forEach((bar) => {
    const monthIndex = bar.dataset.month;
    const amount = monthlySavings[monthIndex].amount;
    bar.style.height = Math.min((amount * 170) / 10000, 170) + "px";
    bar.nextElementSibling.textContent = `$ ${amount}`;
  });
}

// export / import json

exportBtn.addEventListener("click", () => {
  const exporter = new JsonFiles({
    goalsData,
    moneyTrackingData,
    compeletedGoals,
    monthlySavings,
  });
  exporter.exportData();
});

fileInput.addEventListener("change", (e) => {
  
  const file = e.target.files[0];
  console.log(file)
  if (!file) return;

  const loader = new JsonFiles();

  loader.loadData(file, (data) => {
    goalsData = data.goalsData || [];
    moneyTrackingData = data.moneyTrackingData || [];
    compeletedGoals = data.compeletedGoals || [];

    if (data.monthlySavings) {
      data.monthlySavings.forEach((moneyGoal, i) => {
        monthlySavings[i].amount = moneyGoal.amout;
      });
    }
    renderPage();
  });
});

function renderPage() {
  totalSavings.textContent = `${totalSavingsCalc() - GoalsCompletedCalc()}`;
  activeGoals.textContent = goalsData.length;
  goalsCompl.textContent = compeletedGoals.length;
  renderGoals();
  renderMonths();
}
renderPage();
