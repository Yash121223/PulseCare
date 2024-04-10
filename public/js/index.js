const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');


const modal = document.getElementById('profile-modal');
const profileLink = document.getElementById('profile-link');
const closeButton = document.getElementsByClassName('close')[0];


profileLink.addEventListener('click', function(event) {
  event.preventDefault(); 
  modal.style.display = 'flex';
});

closeButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});








// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})





function update_appointment(username,status){
	fetch('/admin/appointmentapprovals',{
		method:'POST',
		headers:{
			'Content-Type':'application/json'
		},
		body:JSON.stringify({
			username:username,
			status:status
		})
	}).then(res=>res.json()).then((obj)=>{
		window.location.reload();
	})
}




window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})