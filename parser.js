
export function parse(str){
    str = str.replace(/([A-z])\w+/, 'Math.$&');
    return str;

}