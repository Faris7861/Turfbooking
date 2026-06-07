function generateSlots(openTime = "00:00", closeTime = "24:00") {
  const slots = [];
  const start = parseInt(openTime.split(":")[0]);
  const end = parseInt(closeTime.split(":")[0]);

  for (let h = start; h < end; h++) {
    slots.push({
      start_time: `${String(h).padStart(2, "0")}:00:00`,
      end_time: `${String(h + 1).padStart(2, "0")}:00:00`,
    });
  }

  return slots;
}

export default generateSlots;
