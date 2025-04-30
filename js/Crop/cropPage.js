initializeCrop();
loadFieldOnLog();
let jwtToken = localStorage.getItem('jwtToken');

function initializeCrop(){
    loadCropTable();
    loadFieldOnLog();
}

function loadCropTable() {
    let jwtToken = localStorage.getItem('jwtToken');
    console.log("jwt token" + jwtToken);

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/crops",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            const crops = res.data;
            addCropToTable(crops);
            document.getElementById("total-crops").innerText = crops.length;
        },
        error: (res) => {
            console.error("Failed to load crops:", res);
        }
    });
}


// Load Field Id
function loadFieldOnLog() {
    let jwtToken = localStorage.getItem('jwtToken');
    console.log("jwt token"+jwtToken)
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/field",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            console.log(res); // Inspect the response to confirm its structure
            let fieldArray = [];
            if (Array.isArray(res)) {
                fieldArray = res;
            } else if (res.data && Array.isArray(res.data)) {
                fieldArray = res.data;
            } else {
                console.error("Unexpected response format", res);
                return;
            }

            // console.log("Field ID ",fieldArray)
            const fieldIdSelect = document.getElementById('cropFieldId');
            const editCropFieldId = document.getElementById('editCropFieldId');
            $('#cropFieldId').empty();
            $('#editCropFieldId').empty();
            $('#cropFieldId').append('<option class="text-blue-500" selected>Select Field Id</option>');
            $('#editCropFieldId').append('<option class="text-blue-500" selected>Select Field Id</option>');

            fieldArray.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode; 
                fieldIdSelect.appendChild(option);
            });

            fieldArray.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode; 
                editCropFieldId.appendChild(option);
            });
        },
        error: (res) => {
            // console.error("Error fetching staff:", res);
        }
    });
}



function addCropToTable(crops) {
    // Get the table body element
    const cropTableBody = document.getElementById("cropTableBody");

    // Clear any existing rows in the table
    cropTableBody.innerHTML = "";

    // Loop through each crop and create a table row
    crops.forEach(crop => {
        // Create a new table row element
        const row = document.createElement("tr");

        // Construct the row HTML
        row.innerHTML = `
        <td class="px-6 py-4">${crop.cropCode || 'N/A'}</td>
            <td class="px-6 py-4"><img src="${crop.cropImage || 'crop image'}"class="w-12 h-12 rounded-md object-cover"></td>
            <td class="px-6 py-4">${crop.cropName || 'N/A'}</td>
            <td class="px-6 py-4">${crop.scientificName || 'N/A'}</td>
            <td class="px-6 py-4">${crop.category || 'N/A'}</td>
            <td class="px-6 py-4">${crop.season || 'N/A'}</td>
            <td class="px-6 py-4">${crop.fieldCode || 'N/A'}</td>
            <td class="px-6 py-4">
                <button class="text-blue-500 px-3 py-1 rounded-md hover:text-blue-700" onclick="editCrop(this)">
                    <i class="fas fa-edit text-lg"></i>
                </button>
                <button class="text-red-500 px-3 py-1 rounded-md hover:text-red-700" onclick="deleteCrop('${crop.cropCode}')">
                <i class="fas fa-trash text-lg"></i>
                </button>
            </td>
        `;

        // Append the row to the table body
        cropTableBody.appendChild(row);
    });
}


// Add Modal Toggle
function toggleAddModal() {
    const addModal = document.getElementById("addModal");
    addModal.classList.toggle("hidden");
}

// Edit Modal Toggle
function toggleEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.classList.toggle("hidden");
}

// Preview Image
function previewImage(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
}

// Add Crop
function addCrop(event) {
    event.preventDefault();
    const form = document.getElementById("addCropForm");

    // Create a FormData object to handle file uploads and other form data
    const formData = new FormData(form); // Automatically includes all form fields and files

    // If you want to manually append the fields in case needed
    const cropImage = document.getElementById("cropImage").files[0];
    const cropName = form.cropName.value;
    const scientificName = form.scientificName.value;
    const category = form.category.value;
    const season = form.season.value;
    const fieldCode = form.cropFieldId.value;

    // Manually append fields (optional if you want to handle files and text fields separately)
    formData.append("cropName", cropName);
    formData.append("scientificName", scientificName);
    formData.append("category", category);
    formData.append("season", season);
    formData.append("fieldCode",fieldCode);
    
    if (cropImage) {
        formData.append("cropImage", cropImage);  // Append the file for upload
    }


    console.log("jwt token"+jwtToken)

    // Send the FormData object via AJAX
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/crops",
        type: "POST",
        data: formData,
        processData: false,  // Don't process the data (important for file upload)
        contentType: false, 
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            alert("Crop saved successfully!");
            toggleAddModal();
            form.reset();
            loadCropTable();
        },
        error: (err) => {
            console.error("Error saving crop:", err);
        }
    });
}


// let cropArray = [];
let cId = null;
// get Table Data in update form
function editCrop(button) {
    const row = button.parentElement.parentElement;
    const form = document.getElementById("editCropForm");

    let cropId = row.cells[0].textContent;
    form.editCropName.value = row.cells[2].textContent;
    form.editScientificName.value = row.cells[3].textContent;
    form.editCategory.value = row.cells[4].textContent;
    form.editSeason.value = row.cells[5].textContent;
    
    cId = cropId;

    toggleEditModal();
}

// Update Crop
function updateCrop(event) {
    event.preventDefault();
    const form = document.getElementById("editCropForm");

    console.log("jwt token"+jwtToken)

    const editCropName = document.getElementById('editCropName').value;
    const editScientificName = document.getElementById('editScientificName').value;
    const editCropImage = document.getElementById('editCropImage').files[0];
    const editCategory = document.getElementById('editCategory').value;
    const editSeason = document.getElementById('editSeason').value;
    const fieldCode = document.getElementById('editCropFieldId').value;

    const formData = new FormData(form);

    formData.append("cropCode", cId);
    formData.append("cropName", editCropName);
    formData.append("scientificName", editScientificName);
    formData.append("category", editCategory);
    formData.append("season", editSeason);
    formData.append("fieldCode", fieldCode);
    
    if (editCropImage) {
        formData.append("cropImage", editCropImage);  // Append the file for upload
    }

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/crops" ,
        type: "PUT",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        data: formData,
        processData: false,  // Don't process the data (important for file upload)
        contentType: false,
         success: (res) => {
            loadCropTable()
            toggleEditModal();
            alert("Update Crops")
        },
        error: (res) => {
            console.error(res);
        }
    });
}

// Delete Crop
function deleteCrop(cropCode) {
    let jwtToken = localStorage.getItem('jwtToken');
    console.log("jwt token"+jwtToken)
    $.ajax({
        url: `http://localhost:5050/greenshow/api/v1/crops/${cropCode}`,
        type: "DELETE",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            alert("Crop Delete Success")
            loadCropTable()
        },
        error: (err) => {
            console.error("Error deleting crop:", err);
        }
    });
    console.log(cropCode);
}
