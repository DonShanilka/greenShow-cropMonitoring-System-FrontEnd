initializeStaff();

function initializeStaff() {
    loadStaffTable();
    loadFieldOnLog();
}

function loadStaffTable() {
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/staff",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            // Assuming the response is an array or contains a 'data' field with an array of staff
            if (Array.isArray(res)) {
                addStaffToTable(res); // If the response is directly an array
            } else if (res.data && Array.isArray(res.data)) {
                addStaffToTable(res.data); // If the response contains a 'data' property
            } else {
                console.error("Unexpected response format:", res);
            }
            const staff = res.data
            document.getElementById("total-staf").innerText = staff.length;
        },
        error: (err) => {
            console.error("Error loading staff data:", err);
        }
    });
}


// Load Field Id
function loadFieldOnLog() {
    let jwtToken = localStorage.getItem('jwtToken');
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
            const fieldIdSelect = document.getElementById('staffFieldId');
            const editFieldId = document.getElementById('editstaffFieldId');
            $('#staffFieldId').empty();
            $('#editCropFieldId').empty();
            $('#staffFieldId').append('<option class="text-blue-500" selected>Select Field Id</option>');
            $('#editstaffFieldId').append('<option class="text-blue-500" selected>Select Field Id</option>');

            fieldArray.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode; 
                fieldIdSelect.appendChild(option);
            });

            fieldArray.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode; 
                editFieldId.appendChild(option);
            });
        },
        error: (res) => {
            console.error("Error fetching staff:", res);
        }
    });
}


function addStaffToTable(staffList) {
    const staffTableBody = document.getElementById("staffTableBody");
    

    // Clear any existing rows in the table
    staffTableBody.innerHTML = "";

    // Validate that staffList is an array
    if (!Array.isArray(staffList)) {
        console.error("Invalid staff data format:", staffList);
        return;
    }

    // Iterate through each staff member and create table rows
    staffList.forEach((staff) => {
        const row = document.createElement("tr");

        // Construct the row's HTML
        row.innerHTML = `
            <td class="px-6 py-4">${staff.id || 'N/A'}</td>
            <td class="px-6 py-4">${staff.firstName || 'N/A'}</td>
            <td class="px-6 py-4">${staff.lastName || 'N/A'}</td>
            <td class="px-6 py-4">${staff.designation || 'N/A'}</td>
            <td class="px-6 py-4">${staff.gender || 'N/A'}</td>
            <td class="px-6 py-4">${staff.joinedDate || 'N/A'}</td>
            <td class="px-6 py-4">${staff.dob || 'N/A'}</td>
            <td class="px-6 py-4">${staff.addressLine1 || 'N/A'}</td>
            <td class="px-6 py-4">${staff.addressLine2 || 'N/A'}</td>
            <td class="px-6 py-4">${staff.addressLine3 || 'N/A'}</td>
            <td class="px-6 py-4">${staff.addressLine4 || 'N/A'}</td>
            <td class="px-6 py-4">${staff.addressLine5 || 'N/A'}</td>
            <td class="px-6 py-4">${staff.contactNo || 'N/A'}</td>
            <td class="px-6 py-4">${staff.email || 'N/A'}</td>
            <td class="px-6 py-4">${staff.role || 'N/A'}</td>
            <td class="px-6 py-4">${staff.fieldCode || 'N/A'}</td>
            <td class="px-6 py-4">
                <button class="text-blue-500 px-3 py-1 rounded-md hover:text-blue-700" onclick="editStaff(this)">
                    <i class="fas fa-edit text-lg"></i>
                </button>
                <button class="text-red-500 px-3 py-1 rounded-md hover:text-red-700" onclick="deleteStaff('${staff.id}')">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </td>
        `;

        // Append the row to the table body
        staffTableBody.appendChild(row);
    });
}

// Initialize the staff table on page load
document.addEventListener("DOMContentLoaded", initializeStaff);

// Function to toggle visibility of the Add Staff Modal
function toggleAddStaffModal() {
    const modal = document.getElementById('addStaffModal');
    modal.classList.toggle('hidden'); // Show or hide the modal
}

// Function to toggle visibility of the Update Staff Modal
function toggleUpdateStaffModal() {
    const updateStaffModal = document.getElementById('updateStaffModal');
    updateStaffModal.classList.toggle('hidden');
}



// Function to handle form submission and add new staff
function saveStaff(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    let jwtToken = localStorage.getItem('jwtToken');

    const form = document.getElementById("addStaffForm");

    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const designation = form.designation.value;
    const gender = form.gender.value;
    const joinedDate = form.joinedDate.value;
    const dob = form.dob.value;
    const addressLine1 = form.address1.value;
    const addressLine2 = form.address2.value;
    const addressLine3 = form.address3.value;
    const addressLine4 = form.address4.value;
    const addressLine5 = form.address5.value;
    const contactNo = form.contactNo.value;
    const email = form.email.value;
    const role = document.getElementById("role").value;
    const fieldCode = document.getElementById("staffFieldId").value;

    let staff = {
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        dob,
        addressLine1,
        addressLine2,
        addressLine3,
        addressLine4,
        addressLine5,
        contactNo,
        email,
        role,
        fieldCode
    }

    let jsonStaff = JSON.stringify(staff)

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/staff",
        type: "POST",
        data: jsonStaff,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
           alert("Save Vehical")
           toggleAddStaffModal();
        },
        error: (res) => {
            console.error(res);
            alert("Cannot Save")
        }
    });

    form.reset();
    // Close the modal after saving
}


let id = null;
function editStaff(button) {
    const row = button.parentElement.parentElement;
    const form = document.getElementById('updateStaffForm');

    let staffCode = row.cells[0].textContent;
    form.firstName.value = row.cells[1].textContent;
    form.lastName.value = row.cells[2].textContent;
    form.designation.value = row.cells[3].textContent;
    form.gender.value = row.cells[4].textContent;
    form.joinedDate.value = row.cells[5].textContent;
    form.dob.value = row.cells[6].textContent;
    form.address1.value = row.cells[7].textContent;
    form.address2.value = row.cells[8].textContent;
    form.address3.value = row.cells[9].textContent;
    form.address4.value = row.cells[10].textContent;
    form.address5.value = row.cells[11].textContent;
    form.contactNo.value = row.cells[12].textContent;
    form.email.value = row.cells[13].textContent;
    form.role.valueOf = row.cells[14].textContent;
    form.editstaffFieldId.valueOf = row.cells[15].textContent;

    id = staffCode;

    toggleUpdateStaffModal();
}


function updateStaff(event) {
    event.preventDefault();
    let jwtToken = localStorage.getItem('jwtToken');
    
    const firstName = document.getElementById('editfirstName').value;
    const lastName = document.getElementById('editlastName').value;
    const designation = document.getElementById('editdesignation').value;
    const gender = document.getElementById('editgender').value;
    const joinedDate = document.getElementById('editjoinedDate').value;
    const dob = document.getElementById('editdob').value;
    const contactNo = document.getElementById('editcontactNo').value;
    const email = document.getElementById('editemail').value;
    const role = document.getElementById('editrole').value;
    const addressLine1 = document.getElementById('editaddress1').value;
    const addressLine2 = document.getElementById('editaddress2').value;
    const addressLine3 = document.getElementById('editaddress3').value;
    const addressLine4 = document.getElementById('editaddress4').value;
    const addressLine5 = document.getElementById('editaddress5').value;
    const fieldCode = document.getElementById("editstaffFieldId").value;

    const staffData = {
        id,
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        dob,
        addressLine1,
        addressLine2,
        addressLine3,
        addressLine4,
        addressLine5,
        contactNo,
        email,
        role,
        fieldCode
    }

    $.ajax({
        url: "http://localhost:5050/greenshow/api/v1/staff",
        type: "PUT",
        data: JSON.stringify(staffData),
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            alert("Staff Update Success ");
            initializeStaff();
            toggleUpdateStaffModal();
        },
        error: (res) => {
            console.error(res);
        }
    });
    // console.log(id);
}


function deleteStaff(staffId) {
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: `http://localhost:5050/greenshow/api/v1/staff/${staffId}`,
        type: "DELETE",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            alert("Staff deleted successfully:");
            loadStaffTable()
        },
        error: (err) => {
            console.error("Error deleting crop:", err);
        }
    });
    console.log(staffId);    
}



