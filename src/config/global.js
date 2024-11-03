import { message } from "antd";

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
window.isEmail = email => emailRegex.test(email)

window.toastify = (msg = "", type) => {
    switch (type) {
        case "success": message.success(msg); break;
        case "error": message.error(msg); break;
        case "info": message.info(msg); break;
        case "warning": message.warning(msg); break;
        default: message.info(msg);
    }
}
window.getRendom=()=>{
  return Math.random().toString(36).slice(2)  
}