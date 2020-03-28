async function checkConfig(config) {
  if (config.keybase.user == undefined ||
    config.keybase.pass == undefined ||
    config.keybase.conversationId == undefined ||
    config.rollup.url == undefined ||
    config.rollup.lastAccount == undefined) {
    return false;
  }
  return true;
}

async function getTimeStr(){
  const currentDate = new Date();
  
  const day = currentDate.getDate();
  const month = currentDate.getMonth()+1; 
  const year = currentDate.getFullYear();  
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  let strTime = "TIME: ";
  strTime += `${day}/${month}/${year} - `;
  strTime += `${hours}:${minutes}:${seconds}`

  return strTime;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  checkConfig,
  getTimeStr,
  timeout,
};