const { config } = require("../config");

class UsersService {
  async authenticateAdmin(username, password) {
    return password === config.adminPasswd && username === config.adminUsername;
  }
}
module.exports = UsersService;
