const navLinks = Array.prototype.slice.call(document.querySelectorAll("a[class*='color']"));
const secondaryNavLinks = Array.prototype.slice.call(document.getElementsByClassName('navbar-secondary'));


function expandHamburger() {
	var i;
	var topNav = document.getElementById("myTopNav");
	if(topNav.className === "header-nav-left") {
		topNav.className += "-responsive";
	} else {
		topNav.className = "header-nav-left";
	}
	for(i=0; i < secondaryNavLinks.length; i++) {
		secondaryNavLinks[i].classList.remove("active");
	}
}

function toggleSubmenu(listItem) {
		
		listItem.addEventListener("mouseover", function () {
			// for each secondary header, remove "active"
			var i;
			for (i=0; i < secondaryNavLinks.length; i++) {
				secondaryNavLinks[i].classList.remove("active");
			}

			// add "active to "this" secondary header
			var secondaryHeader = document.getElementById(this.dataset.target);
			secondaryHeader.className += " active";
		});

}

navLinks.forEach(toggleSubmenu);
