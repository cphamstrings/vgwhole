function openTab(evt, tabGroup) {
	var i, tabcontent, tablinks;
	var contentList = document.getElementsByClassName(tabGroup);

	tabcontent = document.getElementsByClassName("r-tab");
	for(i=0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("r-tab-button");
	for(i=0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}

	for(i=0; i < contentList.length; i++) {
		contentList[i].style.display = "table-cell";
	}
	evt.currentTarget.className += " active";

}

function renderDesktop(width) {
	var content = document.getElementsByClassName('r-tab');
	if (width.matches) {
		for(i=0; i < content.length; i++) {
			content[i].style.display = "table-cell";
		}
	} 

}

function renderMobile(width) {
	var activeButton = document.getElementsByClassName('active');
	var activeContent = document.getElementsByClassName(activeButton[0].dataset.target);
	var content = document.getElementsByClassName('r-tab');
	if (width.matches) {
		for(i=0; i < content.length; i++) {
			content[i].style.display = "none";
		}
		for(i=0; i < activeContent.length; i++) {
			activeContent[i].style.display = 'table-cell';
		}
	}

}

var desktopWidth = window.matchMedia("(min-width: 768px)");
var mobileWidth = window.matchMedia("(max-width: 768px)");
renderDesktop(desktopWidth);
renderMobile(mobileWidth);
mobileWidth.addListener(renderMobile);
desktopWidth.addListener(renderDesktop);
