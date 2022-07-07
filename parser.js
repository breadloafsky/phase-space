export function parse(str){
    str = str.replace('sin', 'Math.sin');
    str = str.replace('cos', 'Math.cos');
    str = str.replace('tan', 'Math.tan');
    
    return str;
    
}