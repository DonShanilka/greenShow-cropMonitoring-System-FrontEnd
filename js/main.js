// function showSection(sectionId) {

//     document.querySelectorAll('.nav-item').forEach(item => {
//     item.classList.remove('active', 'bg-primary', 'text-green-600');
//     item.classList.add('text-gray-800');
//     });

//     // Add active class and change background color for clicked nav item
//     event.currentTarget.classList.add('active', 'bg-primary', 'text-green-600');
//     event.currentTarget.classList.remove('text-gray-800');

//     // Remove active class from all nav items
//     document.querySelectorAll('.nav-item').forEach(item => {
//         item.classList.remove('active');
//     });
    
//     // Add active class to clicked nav item
//     event.currentTarget.classList.add('active');
    
//     // Hide all sections
//     document.querySelectorAll('.content-section').forEach(section => {
//         section.classList.remove('active');
//     });
    
//     // Show selected section
//     const selectedSection = document.getElementById(sectionId);
//     selectedSection.classList.add('active');
    
//     // Trigger fade-in animation
//     selectedSection.style.animation = 'none';
//     selectedSection.offsetHeight; // Trigger reflow
//     selectedSection.style.animation = null;
// }

// // Set initial active state
// document.querySelector(`button[onclick="showSection('dashboard')"]`).classList.add('active');
