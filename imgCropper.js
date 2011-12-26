var imageCrop = function(params) {
    var _pub = {};
	_pub.imgProperties = {};
	_pub.imgProperties.Width = 0;
	_pub.imgProperties.Height = 0;
	_pub.imgProperties.top = 0;
	_pub.imgProperties.left = 0;
	_pub.container
	_pub.img
	_pub.cropArea
	
	_pub.init = function() {
		_pub.container = document.getElementById(params.container);
		_pub.img = _pub.getImage();
		_pub.img.onclick = function(e) {
			var coords = getCursorPosition(e);
			_pub.cropArea = new cropArea(_pub.container, coords.posX, coords.posY, _pub.imgProperties);
		}
		_pub.img.onload = function() {
			_pub.getSize(_pub.img);
			_pub.position(_pub.img);
		}
	};

	_pub.getImage = function() {
		var imgArray = _pub.container.getElementsByTagName("img"), img = false;
		if(imgArray.length > 0) {
			img = imgArray[0];
		}
		return img;
	};

	_pub.getSize = function(img) {
		_pub.imgProperties.Width = img.clientWidth ;
		_pub.imgProperties.Height = img.clientHeight ;
	};

	_pub.position = function(img) {
		_pub.imgProperties.top = img.offsetTop;
		_pub.imgProperties.left = img.offsetLeft;
	};
	return _pub;
};

var cropArea = function(container, posX, posY, imgProperties) {
	var _pub = {};
	_pub.posX = posX;
	_pub.posY = posY;
	_pub.height = 100;
	_pub.width = 100;
	_pub.cropX = 0;
	_pub.cropY = 0;
	_pub.cropH = 0;
	_pub.cropW = 0;
	_pub.isOnMove = false;
	_pub.isResize = false;
	_pub.cropArea = null;
	_pub.limit = {};
	_pub.limit.minWidth = 100;
	_pub.limit.minHeight = 100;
	_pub.resizePoint={};
	_pub.resizePoint.RSTop
	_pub.resizePoint.RSBottom
	_pub.resizePoint.RSLeft
	_pub.resizePoint.RSRight
	_pub.resizePoint.RSTopLeft
	_pub.resizePoint.RSTopRight
	_pub.resizePoint.RSBottomLeft
	_pub.resizePoint.RSBottomRight
	_pub.dx=-_pub.width/2;
	_pub.dy=-_pub.height/2;
	_pub.y=0;
	_pub.x=0;

	//inicializa los objetos cropArea
	_pub.init = function() {
		_pub.cropArea = document.getElementById("crArea");
		if(_pub.cropArea == null) {
			_pub.cropArea = document.createElement("div");
			_pub.cropArea.setAttribute("class", "cropper");
			_pub.cropArea.setAttribute("className", "cropper");
			_pub.cropArea.setAttribute("id", "crArea");
			_pub.cropArea.style.width = _pub.width;
			_pub.cropArea.style.height = _pub.height;
			_pub.getCropLimit();
			_pub.setPosX(posX);
			_pub.setPosY(posY);
			container.appendChild(_pub.cropArea);		
			_pub.createResizePoints();
			//cuando se intenta mover el cropArea
			_pub.cropArea.onmousedown = function(e) {
				nStartX = nStartY = 0;//obtiene las coordenadas de donde se empieza a arrastrar
				for (var xyCrop = _pub.cropArea; xyCrop; xyCrop = xyCrop.offsetParent) {
					nStartX += xyCrop.offsetLeft;
					nStartY += xyCrop.offsetTop;
				}
				_pub.dx= nStartX - e.pageX;
				_pub.dy= nStartY - e.pageY;
				_pub.isOnMove = true;
				_pub.cropArea.setAttribute("class", "cropperMove");
				_pub.cropArea.setAttribute("className", "cropperMove");
				_pub.getCropLimit();
				return false;//para deshabilitar la seleccion del cropArea
			}
			//cuando se suelta el mouse ==> para terminar de arrastrar
			document.onmouseup = function() {
				_pub.cropArea.blur();
				_pub.cropArea.setAttribute("class", "cropper");
				_pub.cropArea.setAttribute("className", "cropper");
				_pub.isOnMove = false;
				_pub.isResize = false;
			}
			//cuando se mueve el cursor sobre el div cropper
			document.onmousemove = _pub.moveArea;
			//Asignacion de eventos a divs Resizes
			for (var i = 0 ; i < 8; i++) {
				_pub.resizePoint[i].onmousedown = function(e) {
					_pub.isResize = true;
					_pub.Point = e.target.id ? e.target.id : e.toElement.id;
					_pub.cropX = parseInt(_pub.cropArea.style.left);
		            _pub.cropY = parseInt(_pub.cropArea.style.top);
		            _pub.cropW = _pub.cropArea.offsetWidth;
		            _pub.cropH = _pub.cropArea.offsetHeight;
		            _pub.y=e.pageY;
		            _pub.x=e.pageX;
					return false;
				}
				//_pub.resizePoint[i].onmousemove = _pub.resizePoints;
			}
		} else {
			container.removeChild(_pub.cropArea);
		}
	}
	
	_pub.getCropLimit = function() {
		_pub.minLeft = imgProperties.left - (_pub.dx);
		_pub.maxRight = imgProperties.left + imgProperties.Width - (_pub.width + _pub.dx)-6;
		_pub.minTop = imgProperties.top - (_pub.dy);
		_pub.maxBottom = imgProperties.top + imgProperties.Height - (_pub.height + _pub.dy)-6;
	}
	
	//se ejecutara mientras este en movimiento el cropArea
	_pub.moveArea = function(e) {
		if(_pub.isOnMove && !_pub.isResize) {
			var coords = getCursorPosition(e);
			//establecer las nuevas coordenadas
			_pub.setPosX(coords.posX);
			_pub.setPosY(coords.posY);
		}
		_pub.resizePoints(e);
	};
	
	//asignacion de coordX del cropArea
	_pub.setPosX = function(x) {
		if(x < _pub.minLeft) {
			_pub.posX = imgProperties.left;
			_pub.cropArea.style.left = _pub.posX + "px";
		} else if(x > _pub.maxRight) {
			_pub.cropArea.style.left = (_pub.maxRight + _pub.dx) + "px";
		} else {
			_pub.posX = x;
			_pub.cropArea.style.left = (x + _pub.dx ) + "px";
		}
	}
	
	//asignacion de coordY del cropArea
	_pub.setPosY = function(y) {
		if(y < _pub.minTop) {
			_pub.posY = imgProperties.top;
			_pub.cropArea.style.top = _pub.posY + "px";
		} else if(y > _pub.maxBottom) {
			_pub.cropArea.style.top = (_pub.maxBottom + _pub.dy) + "px";
		} else {
			_pub.posY = y;
			_pub.cropArea.style.top = (y + _pub.dy) + "px";
		}
	}
	
	//modifica el tamaño del cropArea por medio de los resizePoints
	_pub.resizePoints = function (e) {
		if(_pub.isResize == true){
			var coords = getCursorPosition(e);
			var ny=(coords.posY - _pub.y);
			var nx=(coords.posX - _pub.x);
			if(_pub.Point=="RS0"||_pub.Point=="RS1"||_pub.Point=="RS2"){//arriba
				if(coords.posY < _pub.minTop) {
					_pub.cropArea.style.top = imgProperties.top;
					_pub.cropArea.style.height = _pub.y + _pub.cropH - _pub.minTop-6;
				}else{
					_pub.cropArea.style.top = _pub.cropY + ny;
					_pub.cropArea.style.height = _pub.cropH - ny-6;
				}
			}
			if(_pub.Point=="RS2"||_pub.Point=="RS3"||_pub.Point=="RS4"){//derecha
				if(coords.posX  > _pub.maxRight) {
					_pub.cropArea.style.width=_pub.maxRight - _pub.x+_pub.cropW-6;
				}else if(_pub.limit.minWidth < (_pub.cropW - (_pub.x - coords.posX)-6)){
					_pub.cropArea.style.width = nx + _pub.cropW-6;
				}else{_pub.cropArea.style.width = _pub.limit.minWidth;}
			}
			if(_pub.Point=="RS4"||_pub.Point=="RS5"||_pub.Point=="RS6"){//abajo
				if(coords.posY  > _pub.maxBottom) {
					_pub.cropArea.style.height=_pub.maxBottom - _pub.y+_pub.cropH-6;
				}else{
					_pub.cropArea.style.height = ny + _pub.cropH-6;
				}
			}
			if(_pub.Point=="RS6"||_pub.Point=="RS7"||_pub.Point=="RS0"){//izquierda 
				a=(_pub.cropW - (coords.posX - _pub.x)-5);
				if(coords.posX < _pub.minLeft) {
					_pub.cropArea.style.left = imgProperties.left;
					_pub.cropArea.style.width = _pub.x + _pub.cropW - _pub.minLeft-6;
				}else if(_pub.limit.minWidth < a){
					_pub.cropArea.style.left = _pub.cropX + nx;
					_pub.cropArea.style.width = _pub.cropW - nx-6;
				}else{
					_pub.cropArea.style.width = _pub.limit.minWidth;
				}console.log(a);
			}
			_pub.height = parseInt(_pub.cropArea.style.height);
			_pub.width = parseInt(_pub.cropArea.style.width);
			_pub.setPoints(_pub.width,_pub.height);
		}			
	}

	//crea los puntos de resize
	_pub.createResizePoints = function () {
		for (i=0; i<8; i++) {
			_pub.resizePoint[i] = document.createElement("div");
			_pub.resizePoint[i].setAttribute("class", "resizePoint");
			_pub.resizePoint[i].setAttribute("className", "resizePoint");
			_pub.resizePoint[i].setAttribute("id", "RS"+i);
			_pub.cropArea.appendChild(_pub.resizePoint[i]);	
		}
		_pub.setPoints(_pub.width,_pub.height);
	}
	
	//coloca los puntos de resize
	_pub.setPoints = function (width,height) {
		left= width - width + "px";
		wcenter=(width / 2) -3 + "px";
		right= width - 8 + "px";
		top= height - height + "px";
		hcenter=(height / 2) -3 + "px";
		bottom= height - 8 + "px";
		_pub.resizePoint[0].style.left = _pub.resizePoint[6].style.left = _pub.resizePoint[7].style.left = left;
		_pub.resizePoint[1].style.left = _pub.resizePoint[5].style.left = wcenter;
		_pub.resizePoint[2].style.left = _pub.resizePoint[3].style.left = _pub.resizePoint[4].style.left = right;
		_pub.resizePoint[0].style.top = _pub.resizePoint[1].style.top = _pub.resizePoint[2].style.top = top;
		_pub.resizePoint[3].style.top = _pub.resizePoint[7].style.top = hcenter;
		_pub.resizePoint[4].style.top = _pub.resizePoint[5].style.top = _pub.resizePoint[6].style.top = bottom;
	}
	_pub.init();
	return _pub;
};

// funcion para capturar la poscicion del cursor en firefox,chrome y explorer
function getCursorPosition(e) {
	posx = 0;
	posy = 0;
	if(!e)
		var e = window.event;
	if(e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if(e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	//regresa las coordenadas en un obj json
	return ( {
		"posX" : posx,
		"posY" : posy
	});
}