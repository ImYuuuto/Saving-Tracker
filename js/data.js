export class Goal {
  constructor(title, amount) {
    this.title = title;
    this.amount = parseFloat(amount);
  }
}
export class Saving {
  constructor(amount, dateMonth) {
    this.amount = parseFloat(amount);
    this.dateMonth = dateMonth;
  }
}

export class JsonFiles {
  constructor(data) {
    this.data = data;
  }
  exportData() {
    const jsonData = JSON.stringify(this.data, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "saving-data.json";
    a.click();

    URL.revokeObjectURL(url);
  }
  loadData(file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        callback(parsed);
      } catch (err) {
        console.error("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }
}
