var imageCrop = function(params){
    var _pub                    = {};
    _pub.limit                  = {};
    _pub.limit.minWidth         = 60;
    _pub.limit.minHeight        = 60;
    _pub.imgProperties          = {};
    _pub.imgProperties.Width    = 0;
    _pub.imgProperties.Height   = 0;
    _pub.container;
    _pub.img;
   
    _pub.init = function () {
        _pub.container = document.getElementById(params.container);
        _pub.img = _pub.getImage();   
    };
    
    _pub.getImage = function () {
        var 
        imgArray = _pub.container.getElementsByTagName(“img”),
        img = false;
        
        if (imgArray.length > 0) {
             img = imgArray[0];
        }
        return img;
    };
    
    _pub.getSize = function (img) {
        var width = img.width;
        var height = img.height;   
    };
    
    return _pub;
};