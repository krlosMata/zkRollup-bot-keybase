const axios = require("axios");

class RollupCli {

  constructor(url){
    this.url = url;
  }

  async getStatus(){
    const res = await axios.get(`${this.url}/state`);
    return res.data;
  }

  async getInfoAccount(id){
    const res = await axios.get(`${this.url}/accounts/${id}`);
    return res.data;
  }

}

module.exports = RollupCli;