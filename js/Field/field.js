initializeField()

function initializeField(){
    loadFieldTable()
  
}

function loadFieldTable() {
    let jwtToken = localStorage.getItem('jwtToken');
    console.log(jwtToken)

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/field",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            addFieldToTable(res);
            const field = res.length;
            document.getElementById("total-fields").innerText = field;
        },
        error: (err) => {
            console.error("Error loading field data:", err);
        }
    });
}

function addFieldToTable(fields) {
    const fieldTableBody = document.getElementById("fieldTableBody");

    // Clear any existing rows in the table
    fieldTableBody.innerHTML = "";

    // Loop through each field and create table rows
    fields.forEach((field) => {
        const row = document.createElement("tr");

        // Construct the row's HTML
        row.innerHTML = `
            <td class="px-6 py-4">${field.fieldCode || 'N/A'}</td>
            <td class="px-6 py-4">${field.fieldName || 'N/A'}</td>
            <td class="px-6 py-4">${field.location || 'N/A'}</td>
            <td class="px-6 py-4">${field.extentSize || 'N/A'}</td>
            <td class="px-6 py-4">
                <img src="${field.image1 || 'https://via.placeholder.com/50'}" 
                     alt="Field Image 1" 
                     class="w-12 h-12 rounded-md object-cover">
            </td>
            <td class="px-6 py-4">
                <img src="${field.image2 || 'https://via.placeholder.com/50'}" 
                     alt="Field Image 2" 
                     class="w-12 h-12 rounded-md object-cover">
            </td>
            <td class="px-6 py-4">
                <button class="text-blue-500 hover:text-blue-800 px-3 py-1 rounded-md " onclick="editField(this)">
                    <i class="fas fa-edit text-lg"></i>
                </button>
                <button class="text-red-500 hover:text-red-800 px-3 py-1 rounded-md " onclick="deleteField('${field.fieldCode}')">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </td>
        `;

        // Append the row to the table body
        fieldTableBody.appendChild(row);
    });
}


// Toggle Add Modal
function ftoggleAddModal() {
    const addModal = document.getElementById("faddModal");
    addModal.classList.toggle("hidden");
}

// Toggle Edit Modal
function ftoggleEditModal() {
    const editModal = document.getElementById("feditModal");
    editModal.classList.toggle("hidden");
}

// Add Field
function addField(event) {
    event.preventDefault();

    const form = document.getElementById("addFieldForm");
    const fieldTableBody = document.getElementById("fieldTableBody");
    let jwtToken = localStorage.getItem('jwtToken');
    console.log(jwtToken)

    // Extract form data
    // const fieldCode = form.fieldCode.value.trim();
    const fieldName = form.fieldName.value.trim();
    const location = form.location.value.trim();
    const extentSize = form.extentSize.value.trim();
    const fieldImage1 = form.fieldImage1.files[0]?.name || "No Image";
    const fieldImage2 = form.fieldImage2.files[0]?.name || "No Image";

    const formData = new FormData(form);

    formData.append("fieldName", fieldName);
    formData.append("location", location);
    formData.append("extentSize", extentSize);
    // formData.append("season", season);
    
    if (fieldImage1) {
        formData.append("fieldImage1", fieldImage1);  // Append the file for upload
    }

    if (fieldImage2) {
        formData.append("fieldImage2", fieldImage2);  // Append the file for upload
    }

    // Send the FormData object via AJAX
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/field",
        type: "POST",
        data: formData,
        processData: false,  // Don't process the data (important for file upload)
        contentType: false,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },  // Don't set content type as jQuery will set it to multipart/form-data automatically
        success: (res) => {
            alert("Field saved successfully!");
        },
        error: (err) => {
            console.error("Error saving crop:", err);
        }
    });


    // Reset form and close modal
    form.reset();
    ftoggleAddModal();
}


// Edit Field
let fieldId = null;
function editField(button) {
    const row = button.parentElement.parentElement;
    const form = document.getElementById("editFieldForm");

    let fieldCode = row.cells[0].textContent;
    form.fieldName.value = row.cells[1].textContent;
    form.location.value = row.cells[2].textContent;
    form.extentSize.value = row.cells[3].textContent;
    
    fieldId = fieldCode;

    ftoggleEditModal();
}

// Update Field
function updateField(event) {
    event.preventDefault();
    const form = document.getElementById("editFieldForm");
    
    const editfieldName = document.getElementById('editfieldName').value;
    const editlocation = document.getElementById('editlocation').value;
    const editextentSize = document.getElementById('editextentSize').value;
    const editfieldImage1 = document.getElementById('editfieldImage1').files[0];
    const editfieldImage2 = document.getElementById('editfieldImage2').files[0];

    const formData = new FormData(form);

    formData.append("fieldCode", fieldId);
    formData.append("fieldName", editfieldName);
    formData.append("location", editlocation);
    formData.append("extentSize", editextentSize);
    
    if (editfieldImage1) {
        formData.append("fieldImage1", editfieldImage1);  
    }

    if (editfieldImage2) {
        formData.append("fieldImage2", editfieldImage2); 
    }

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/field",
        type: "PUT",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }, 
        data: formData,
        processData: false, 
        contentType: false,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            console.log(res);
            loadFieldTable();
            ftoggleEditModal();
            console.log("Update Field");
        },
        error: (res) => {
            console.error(res);
        }
    });
}

// Delete Field
function deleteField(fieldCode) {
    $.ajax({
        url: `http://localhost:5050/greenshow/api/v1/field/${fieldCode}`,
        type: "DELETE",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            console.log("Equipment deleted successfully:", res);
            loadFieldTable();
        },
        error: (err) => {
            console.error("Error deleting crop:", err);
        }
    });
    // console.log(fieldCode);
}
