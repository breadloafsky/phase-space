
export function parse(str){
    str = str.replace(/([a-z])\w+/, 'Math.$&');
    return str;
}