
export function parse(str){
    str = str.replace(/([A-z])\w+/g, 'Math.$&');
    return str;

}