const readline = require("readline");

// 1. KHOI TAO CSDL THUE BAO SAAS BAN DAU
const subscriptions = [
  {
    subscriptionId: "SUB_001",
    customerName: "Nguyen Van An",
    planTier: "PERSONAL",
    deviceLimit: 2,
    status: "ACTIVE"
  },
  {
    subscriptionId: "SUB_002",
    customerName: "Tran Thi Mai",
    planTier: "FAMILY",
    deviceLimit: 5,
    status: "ACTIVE"
  },
  {
    subscriptionId: "SUB_003",
    customerName: "Le Van Binh",
    planTier: "PERSONAL",
    deviceLimit: 2,
    status: "GRACE_PERIOD"
  }
];

let autoIdCounter = 4;

// Cau hinh readline interface de tuong tac qua console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 2. CAC HAM CRUD DICH VU THUE BAO

// Ham ho trou tim kiem thue bao theo ID
const findSubscriptionById = (list, subId) => {
  if (!subId) return null;
  const targetId = subId.trim().toUpperCase();
  for (let i = 0; i < list.length; i++) {
    if (list[i].subscriptionId.toUpperCase() === targetId) {
      return list[i];
    }
  }
  return null;
};

// CREATE: Them thue bao moi
const addSubscription = (list, customerName, planTier) => {
  if (!customerName || customerName.trim() === "") {
    console.log("[ERROR]: Ten khach hang khong duoc de rong.");
    return false;
  }

  const cleanPlan = planTier ? planTier.trim().toUpperCase() : "PERSONAL";
  if (cleanPlan !== "PERSONAL" && cleanPlan !== "FAMILY") {
    console.log("[ERROR]: Goi cuoc khong hop le (Chi chap nhan PERSONAL hoac FAMILY).");
    return false;
  }

  const generatedId = "SUB_" + autoIdCounter.toString().padStart(3, "0");
  autoIdCounter++;

  const limit = cleanPlan === "FAMILY" ? 5 : 2;

  const newSub = {
    subscriptionId: generatedId,
    customerName: customerName.trim(),
    planTier: cleanPlan,
    deviceLimit: limit,
    status: "ACTIVE"
  };

  list.push(newSub);
  console.log(`[SUCCESS]: Da tao thanh cong thue bao "${newSub.customerName}" voi ma ${newSub.subscriptionId}`);
  return true;
};

// READ: Xem danh sach thue bao dang bieu dien dang bang
const listSubscriptions = (list) => {
  const borderLine = "-".repeat(85);
  console.log("\n" + borderLine);
  console.log("                       DANH SACH THUE BAO DICH VU CLOUD                       ");
  console.log(borderLine);
  console.log(
    "MA SUB".padEnd(12) +
    "TEN KHACH HANG".padEnd(22) +
    "GOI CUOC".padEnd(14) +
    "GIOI HAN TB".padEnd(16) +
    "TRANG THAI"
  );
  console.log(borderLine);

  if (list.length === 0) {
    console.log("                      KHONG CO DU LIEU THUE BAO TRONG HE THONG                      ");
  } else {
    for (let i = 0; i < list.length; i++) {
      const sub = list[i];
      const colId = sub.subscriptionId.padEnd(12);
      const colName = (sub.customerName.length > 20 ? sub.customerName.slice(0, 17) + "..." : sub.customerName).padEnd(22);
      const colPlan = sub.planTier.padEnd(14);
      const colLimit = (sub.deviceLimit.toString() + " thiet bi").padEnd(16);
      const colStatus = sub.status;

      console.log(`${colId}${colName}${colPlan}${colLimit}${colStatus}`);
    }
  }

  console.log(borderLine);
  console.log(`TONG SO THUE BAO: ${list.length.toString().padStart(8)} tai khoan`);
  console.log(borderLine);
};

// UPDATE: Cap nhat thong tin goi cuoc thue bao
const updateSubscription = (list, subId, newPlanTier, newStatus) => {
  const targetSub = findSubscriptionById(list, subId);
  if (!targetSub) {
    console.log(`[ERROR]: Khong tim thay thue bao voi ma "${subId}".`);
    return false;
  }

  if (newPlanTier !== undefined && newPlanTier.trim() !== "") {
    const cleanPlan = newPlanTier.trim().toUpperCase();
    if (cleanPlan === "PERSONAL" || cleanPlan === "FAMILY") {
      targetSub.planTier = cleanPlan;
      targetSub.deviceLimit = cleanPlan === "FAMILY" ? 5 : 2;
    } else {
      console.log("[WARNING]: Goi cuoc cap nhat khong hop le, giu nguyen goi cu.");
    }
  }

  if (newStatus !== undefined && newStatus.trim() !== "") {
    targetSub.status = newStatus.trim().toUpperCase();
  }

  console.log(`[SUCCESS]: Cap nhat thanh cong thue bao "${targetSub.subscriptionId}".`);
  return true;
};

// DELETE: Huy va xoa thue bao khoi he thong
const deleteSubscription = (list, subId) => {
  if (!subId) {
    console.log("[ERROR]: Ma thue bao khong hop le.");
    return false;
  }

  let foundIndex = -1;
  const targetId = subId.trim().toUpperCase();
  for (let i = 0; i < list.length; i++) {
    if (list[i].subscriptionId.toUpperCase() === targetId) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    console.log(`[ERROR]: Khong tim thay thue bao voi ma "${subId}" de huy.`);
    return false;
  }

  const removedItem = list.splice(foundIndex, 1)[0];
  console.log(`[SUCCESS]: Da huy va xoa thue bao "${removedItem.customerName}" (Ma: ${removedItem.subscriptionId}).`);
  return true;
};

// 3. XAY DUNG GIAO DIEN CONSOLE MENU DIEU HUONG
const showMenu = () => {
  console.log("\n================================================");
  console.log("       QUAN LY THUE BAO SAAS RIKKEISTREAM        ");
  console.log("================================================");
  console.log("1. Them thue bao moi");
  console.log("2. Xem danh sach toan bo thue bao");
  console.log("3. Cập nhat goi cuoc thue bao");
  console.log("4. Huy va xoa thue bao");
  console.log("5. Thoat chuong trinh");
  console.log("================================================");
};

const promptUserMenu = () => {
  showMenu();
  rl.question("Chon chuc nang (1-5): ", (answer) => {
    const choice = answer.trim();

    switch (choice) {
      case "1": {
        rl.question("Nhap ten khach hang: ", (nameInput) => {
          rl.question("Nhap goi cuoc (PERSONAL / FAMILY): ", (planInput) => {
            addSubscription(subscriptions, nameInput, planInput);
            promptUserMenu();
          });
        });
        break;
      }

      case "2": {
        listSubscriptions(subscriptions);
        promptUserMenu();
        break;
      }

      case "3": {
        rl.question("Nhap ma thue bao can cap nhat (VD: SUB_001): ", (idInput) => {
          rl.question("Nhap goi cuoc moi (PERSONAL / FAMILY): ", (planInput) => {
            rl.question("Nhap trang thai moi (ACTIVE / GRACE_PERIOD / EXPIRED): ", (statusInput) => {
              updateSubscription(subscriptions, idInput, planInput, statusInput);
              promptUserMenu();
            });
          });
        });
        break;
      }

      case "4": {
        rl.question("Nhap ma thue bao can huy (VD: SUB_002): ", (idInput) => {
          deleteSubscription(subscriptions, idInput);
          promptUserMenu();
        });
      }

      case "5": {
        console.log("\nCam ơn ban da su dung phan mem quan ly RikkeiStream. Tam biet!");
        rl.close();
        break;
      }

      default: {
        console.log("[ERROR]: Lua chon khong hop le. Vui long chon tu 1 den 5.");
        promptUserMenu();
        break;
      }
    }
  });
};

// 4. KHOI DONG CHUONG TRINH CLI
console.log("Khoi dong ung dụng Console Menu Quan tri Thue bao...");
promptUserMenu();