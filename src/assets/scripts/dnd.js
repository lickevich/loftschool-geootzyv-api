const popup = document.querySelector('.geo-popup');
const popupHeader = document.querySelector('.geo-popup__header');

popupHeader.onmousedown = function(e) {

    const coords = getCoords(popup);
    const shiftX = e.pageX - coords.left;
    const shiftY = e.pageY - coords.top;

    popup.style.position = 'absolute';
    moveAt(e);
  
    popup.style.zIndex = 1000;
  
    function moveAt(e) {
      popup.style.left = e.pageX - shiftX / 2 + 'px';
      popup.style.top = e.pageY - shiftY / 2 + 'px';
    }
  
    document.onmousemove = function(e) {
      moveAt(e);
    }
  
    popup.onmouseup = function() {
      document.onmousemove = null;
      popup.onmouseup = null;
    }
}

function getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
}