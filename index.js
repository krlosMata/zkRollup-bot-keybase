const keybaseBot = require("keybase-bot");
const fs = require("fs");

const actions = require("./src/actions");
const utils = require("./src/utils");
const RollupCli = require("./src/rollup-api");

const argv = require("yargs")
    .usage(`index.js <command>

ls command
=============
    
    index.js ls
    
    Lists all open chats
        `)
    .argv;

const command = (argv._[0]) ? argv._[0].toUpperCase() : "default";

(async () => {
  try {
    // Global vars
    const TIMEOUT = 3 * 60 * 1000;
    const TIMEOUT_ACCOUNT_FOUND = 5 * 1000;
    let lastBatchSynched = 0;

    // load configuration file
    const config = require("./config.json");
    if (!utils.checkConfig(config)){
      console.error("Missing some configuration parameter in config.json");
      process.exit(1);
    }
    const username = config.keybase.user;
    const paperkey = config.keybase.pass;
    const conversationId = config.keybase.conversationId;
    let lastAccount = config.rollup.lastAccount;

    // Rollup Client initialization
    const rollupCli = new RollupCli(config.rollup.url);

    // Keybase bot initialization
    let bot;
    try {
      bot = new keybaseBot();
      await bot.init(username, paperkey, { verbose: false });
      console.log("Your bot is initialized");
      console.log(`It is logged in as: ${bot.myInfo().username}`);
    } catch (error){
      console.error("Bot has not been initialized correctly");
      console.log("Error: " + error);
      process.exit(1);
    }

    if (command == "LS"){
      const resList = await actions.getChatList(bot);
      console.log(resList);
      process.exit(0);
    } else if (command == "default"){
      let hiMess =":wave: Hi! I'm zkRollup bot...";
      hiMess += "and I'm here to check your zkRollup status :upside_down_face:";

      await actions.sendMessage(bot, conversationId, hiMess);

      while (true){
        try {
          // get current time
          const time = await utils.getTimeStr();
          let message = `${time}\n`;

          // check state
          let lastBatch;
          try {
            const resStatus = await rollupCli.getStatus();
            lastBatch = resStatus.rollupSynch.lastBatchSynched;
          } catch (error){
            message += "MESSAGE: Not possible to get rollup state";
            await actions.sendMessage(bot, conversationId, message);
            await checkStateBack();
            continue;
          }

          // Check if new account has been added
          try {
            const accountInfo = await rollupCli.getInfoAccount(lastAccount + 1);
            message += "MESSAGE: new account has been added\n";
            message += `TOTAL ACCOUNTS: ${accountInfo.idx}`;
            await actions.sendMessage(bot, conversationId, message);
            await saveLastAccount(accountInfo.idx);
            await utils.timeout(TIMEOUT_ACCOUNT_FOUND);
            continue;
          } catch (error){
            ;
          }

          // check if batch has increased correctly
          if (lastBatch <= lastBatchSynched){
            message += "MESSAGE: Last batch has not been increased properly";
            await actions.sendMessage(bot, conversationId, message);
            await checkBatchBack(lastBatch);
            continue;
          } else lastBatchSynched = lastBatch;

          await utils.timeout(TIMEOUT);
        } catch (error){
          console.log(error.stack);
          console.log("ERROR: " + error);
          await timeout(TIMEOUT);
        }
      }
    }
    
    // Detects when state data could be retrieved again
    async function checkStateBack(){
      let flagStateOk = false;
      
      while (!flagStateOk){
        await utils.timeout(TIMEOUT);
        try {
          await rollupCli.getStatus();
          flagStateOk = true;
        } catch(error){
          continue;
        }
      }

      const time = await utils.getTimeStr();
      let message = `${time}\n`;
      message += "INFO: zkRollup is online again";
      await actions.sendMessage(bot, conversationId, message);
    }

    // Detects if there is a new batch forged
    async function checkBatchBack(lastBatchForged){
      let flagForgeOk = false;
      
      while (!flagForgeOk){
        await utils.timeout(TIMEOUT);
        const resStatus = await rollupCli.getStatus();
        const lastBatch = resStatus.rollupSynch.lastBatchSynched;
        if (lastBatch > lastBatchForged)
          flagForgeOk = true;
      }

      const time = await utils.getTimeStr();
      let message = `${time}\n`;
      message += "INFO: zkRollup is forging again";
      await actions.sendMessage(bot, conversationId, message);
    }

    // Save last account
    async function saveLastAccount(newLastAccount){
      lastAccount = newLastAccount;
      config.rollup.lastAccount = newLastAccount;
      fs.writeFileSync("./config.json", JSON.stringify(config));
    }

  } catch (error){
    console.log(error.stack);
    console.log("ERROR: " + error);
    process.exit(1);
  }
})();