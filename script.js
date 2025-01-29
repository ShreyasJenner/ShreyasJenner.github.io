document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const uploadedImages = document.getElementById("uploaded-images");
    const loadConfigButton = document.getElementById("load-config");
    const saveConfigButton = document.getElementById("save-config");
    const configFileInput = document.getElementById("config-file-input");
    const searchInput = document.getElementById("search-input");
    let selectedImages = new Set();
    let uploadedImageMap = new Map(); // Track uploaded images by name

    // Add click handler for load button
    loadConfigButton.addEventListener("click", function() {
        configFileInput.click(); // This triggers the file input
    });

    fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        Array.from(files).forEach(file => {
            // Check if image with same name already exists
            if (!uploadedImageMap.has(file.name)) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    createImageElement(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            } else {
                console.log(`Image "${file.name}" already exists`);
            }
        });
        fileInput.value = ''; // Clear the input after processing
    });

    function createImageElement(src, name) {
        const container = document.createElement("div");
        container.classList.add("image-container");
        
        const img = document.createElement("img");
        img.src = src;
        img.alt = name;
        img.draggable = true;
        img.classList.add("uploaded-image");
        img.dataset.listened = "false";
        
        img.addEventListener("dragstart", handleDragStart);
        img.addEventListener("click", toggleSelection);
        img.addEventListener("dblclick", toggleListened);
        
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerText = "✖";
        removeButton.addEventListener("click", function () {
            uploadedImageMap.delete(name); // Remove from tracking map
            container.remove();
        });
        
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = name;
        
        container.appendChild(tooltip);
        container.appendChild(img);
        container.appendChild(removeButton);
        uploadedImages.appendChild(container);

        // Add to tracking map
        uploadedImageMap.set(name, {
            container: container,
            src: src,
            listened: false
        });

        container.addEventListener("mouseenter", function () {
            tooltip.style.visibility = "visible";
        });
        container.addEventListener("mouseleave", function () {
            tooltip.style.visibility = "hidden";
        });
    }

    function clearAllTiers() {
        document.querySelectorAll(".drop-zone").forEach(zone => {
            while (zone.firstChild) {
                // Move images back to uploaded images section before clearing
                const imgContainer = zone.firstChild;
                uploadedImages.appendChild(imgContainer);
            }
        });
    }

    saveConfigButton.addEventListener("click", function () {
        const config = {
            tiers: {
                S: getImagesInTier("tier-s"),
                A: getImagesInTier("tier-a"),
                B: getImagesInTier("tier-b"),
                C: getImagesInTier("tier-c")
            }
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tierlist-config.json";
        a.click();
        URL.revokeObjectURL(a.href);
    });

    function getImagesInTier(tierId) {
        const tier = document.getElementById(tierId);
        return Array.from(tier.querySelectorAll(".drop-zone img")).map(img => ({
            src: img.src,
            name: img.alt,
            listened: img.dataset.listened === 'true'
        }));
    }

    configFileInput.addEventListener("change", function () {
        const file = configFileInput.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const config = JSON.parse(e.target.result);
                restoreConfiguration(config);
            } catch (error) {
                console.error("Error loading configuration:", error);
                alert("Error loading configuration file. Please make sure it's a valid JSON file.");
            }
        };
        reader.readAsText(file);
        configFileInput.value = ''; // Clear the input after loading
    });

    function restoreConfiguration(config) {
        // Don't clear the uploaded images, just their tier assignments
        clearAllTiers();

        // Process each tier
        Object.entries(config.tiers).forEach(([tierId, images]) => {
            const tier = document.getElementById(`tier-${tierId.toLowerCase()}`);
            const dropZone = tier.querySelector(".drop-zone");

            images.forEach(image => {
                // If the image doesn't exist in our map yet, create it
                if (!uploadedImageMap.has(image.name)) {
                    createImageElement(image.src, image.name);
                }
                
                // Get the image container (either existing or newly created)
                const imageData = uploadedImageMap.get(image.name);
                if (imageData) {
                    const imgElement = imageData.container.querySelector('img');
                    // Update listened status
                    imgElement.dataset.listened = image.listened;
                    imgElement.classList.toggle("listened", image.listened);
                    // Move to appropriate tier
                    dropZone.appendChild(imageData.container);
                }
            });
        });
    }

    function toggleSelection(event) {
        const img = event.target;
        if (selectedImages.has(img)) {
            selectedImages.delete(img);
            img.classList.remove("selected");
        } else {
            selectedImages.add(img);
            img.classList.add("selected");
        }
    }

    function toggleListened(event) {
        const img = event.target;
        img.dataset.listened = img.dataset.listened === "false" ? "true" : "false";
        img.classList.toggle("listened", img.dataset.listened === "true");
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", "dragging");
    }

    document.querySelectorAll(".drop-zone").forEach(zone => {
        zone.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        zone.addEventListener("drop", function (event) {
            event.preventDefault();
            selectedImages.forEach(img => {
                zone.appendChild(img.parentElement);
                img.classList.remove("selected");
            });
            selectedImages.clear();
        });
    });

    // Search functionality
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        uploadedImageMap.forEach((data, name) => {
            const container = data.container;
            if (name.toLowerCase().includes(query)) {
                container.style.display = "inline-block";
            } else {
                container.style.display = "none";
            }
        });
    });
});
