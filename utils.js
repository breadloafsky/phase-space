
export function parse(str){
    str = str.replace(/([A-z])\w+/g, 'Math.$&');
    return str;
}

export function extractFromFile(path){
  
  var t = 0;
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("text/plain");
  xhr.open('GET', path, false); 
  xhr.send(null);
  return xhr.responseText;
  
}