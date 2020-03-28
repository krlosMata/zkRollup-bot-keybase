# zkRollup-bot-keybase
Bot to check [zkRollup](https://github.com/iden3/rollup/blob/testnet/README.md) state.

It sends notifications automatically to a keybase conversation if:
  - Cannot get state information
  - Batch forged has not increased correctly
  - New account is added

## Config
### Keybase
`user`: user name
`pass`: paper key
`conversationId`: conversation identifier

### Rollup
`url`: rollup url
`lastAccount`: last account found

### Example
```json
{
  "keybase": {
    "user": "userNameX",
    "pass": "paperKey",
    "conversationId": "channelId"
  },
  "rollup": {
    "url": "rollupUrl",
    "lastAccount": 4
  }
}
```

## Usage
### Clone the repository
```bash=
git clone https://github.com/krlosMata/zkRollup-bot-keybase.git
cd zkRollup-bot-keybase
```

### Install dependencies
```bash=
npm i
```

### Configuration file
Create `config.json` file with all the required parameters

### Check availables conversations
```bash=
npm run list:chats
```

### Run bot
```bash=
npm run start
```