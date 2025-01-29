document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const uploadedImages = document.getElementById("uploaded-images");
    const loadConfigButton = document.getElementById("load-config");
    const saveConfigButton = document.getElementById("save-config");
    const configFileInput = document.getElementById("config-file-input");
    const searchInput = document.getElementById("search-input");
    let selectedImages = new Set();

    fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                createImageElement(e.target.result, file.name);
            };
            reader.readAsDataURL(file);
        });
    });

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const images = document.querySelectorAll(".image-container");
        images.forEach(imageContainer => {
            const imageName = imageContainer.querySelector("img").alt.toLowerCase();
            if (imageName.includes(query)) {
                imageContainer.style.display = "inline-block"; // Show matching images
            } else {
                imageContainer.style.display = "none"; // Hide non-matching images
            }
        });
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
            container.remove();
        });
        
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = name;
        container.appendChild(tooltip);
        
        container.appendChild(img);
        container.appendChild(removeButton);
        uploadedImages.appendChild(container);

        container.addEventListener("mouseenter", function () {
            tooltip.style.visibility = "visible";
        });
        container.addEventListener("mouseleave", function () {
            tooltip.style.visibility = "hidden";
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

    loadConfigButton.addEventListener("click", function () {
        configFileInput.click();
    });

    saveConfigButton.addEventListener("click", function () {
        const config = {
            images: Array.from(document.querySelectorAll(".image-container img")).map(img => ({
                src: img.src,
                name: img.alt,
                listened: img.dataset.listened
            }))
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tierlist-config.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    configFileInput.addEventListener("change", function () {
        const file = configFileInput.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const config = JSON.parse(e.target.result);
            restoreConfiguration(config);
        };
        reader.readAsText(file);
    });

    function restoreConfiguration(config) {
        uploadedImages.innerHTML = "";
        document.querySelectorAll(".drop-zone").forEach(zone => zone.innerHTML = "");

        config.images.forEach(image => {
            createImageElement(image.src, image.name);
            const imgElement = uploadedImages.lastChild.querySelector("img");
            imgElement.dataset.listened = image.listened;
            imgElement.classList.toggle("listened", imgElement.dataset.listened === "true");
        });
    }
});

