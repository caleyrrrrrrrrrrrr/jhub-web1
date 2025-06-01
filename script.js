document.addEventListener("DOMContentLoaded", () => {
    const rackSlotsContainer = document.getElementById("rackSlots");
    const numberInput = document.getElementById("numberInput");
    const usedU = document.getElementById("usedU");
    let usedSlots = 0;
    let slots = [];
  
    function buildRack() {
      const totalSlots = parseInt(numberInput.value, 10);
      rackSlotsContainer.innerHTML = ''; // Clear existing slots
      slots = [];
  
      for (let i = 0; i < totalSlots; i++) {
        const slotWrapper = document.createElement("div");
        slotWrapper.classList.add("rack-slot-wrapper");
      
        // Create the U number 
        const uNumber = document.createElement("div");
        uNumber.classList.add("u-number-label");
        uNumber.textContent = `${i + 1}U`;
      
        // Create the actual slot
        const slot = document.createElement("div");
        slot.classList.add("rack-slot");
        slot.dataset.filled = "false";
        slot.dataset.index = i;
      
        slotWrapper.appendChild(uNumber);
        slotWrapper.appendChild(slot);
        rackSlotsContainer.appendChild(slotWrapper);
      
        slots.push(slot);
      }
      

        // Update rack title and usage display
  usedU.textContent = `${usedSlots}/${totalSlots}U`;

  // Rebind number input event after regenerating it
  document.getElementById("numberInput").addEventListener("input", (event) => {
    usedSlots = 0;
    buildRack();
  });
}
  
    numberInput.addEventListener("input", (event) => {
      buildRack();
      usedSlots = 0;
      usedU.textContent = `Used Slots: ${usedSlots}`;
    });
  
    // Build rack initially
    buildRack();
  
    // Track dragged component size
    let draggedSize = 1;
    let draggedType = "1U";
  
    const components = document.querySelectorAll(".component");
    components.forEach((component) => {
      component.addEventListener("dragstart", (e) => {
        draggedSize = parseInt(component.dataset.size);
        //draggedType = component.textContent;
        draggedImage = component.querySelector("img").src 
        e.dataTransfer.setData("text/plain", "rack-component");
      });
    });
  
    // Drop target area logic
    rackSlotsContainer.addEventListener("dragover", (e) => e.preventDefault());
  
    rackSlotsContainer.addEventListener("drop", (e) => {
      e.preventDefault();
  
      const rect = rackSlotsContainer.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const slotHeight = slots[0].offsetHeight;
  
      // Convert y position to index
      const dropIndex = Math.floor(y / slotHeight);
  
      if (dropIndex + draggedSize > slots.length) {
        alert("Not enough space to place this component.");
        return;
      }
  
      const targetSlots = slots.slice(dropIndex, dropIndex + draggedSize);
      const canPlace = targetSlots.every((s) => s.dataset.filled === "false");
  
      if (!canPlace) {
        alert("Not enough space to place this component.");
        return;
      }
  
      // Mark slots as filled
      targetSlots.forEach((s) => {
        s.dataset.filled = "true";
      });
  
      usedSlots += draggedSize;
      usedU.textContent = `Used Slots: ${usedSlots}/${slots.length}U`;
  
      // Create placed component block
      const block = document.createElement("div");
      block.classList.add("component-block");
      //block.textContent = draggedType;
      block.style.height = `${slotHeight * draggedSize}px`;
      block.style.top = `${slotHeight * dropIndex}px`;
      block.dataset.size = draggedSize;

      // add image to block
      const img = document.createElement("img");
      img.src = draggedImage;
      img.alt = draggedType;
      img.style.width = "100%";
      img.style.height = "100%";
      block.appendChild(img);
  
      // Click to remove
      block.addEventListener("click", () => {
        rackSlotsContainer.removeChild(block);
        targetSlots.forEach((s) => {
          s.dataset.filled = "false";
        });
        usedSlots -= draggedSize;
        usedU.textContent = `Used Slots: ${usedSlots}/${slots.length}U`;
      });
  
      rackSlotsContainer.appendChild(block);
    });
  
    // Instructions logic
    const modal = document.getElementById("instructionsModal");
    const btn = document.getElementById("showInstructions");
    const span = document.querySelector(".close-button");
  
    btn.onclick = () => {
      modal.style.display = "block";
    };
  
    span.onclick = () => {
      modal.style.display = "none";
    };
  
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  });