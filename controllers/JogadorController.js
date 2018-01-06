var MongoService = require('../services/MongoService');

module.exports = class JogadorController{

  constructor(){
    this.mongoService = new MongoService();
  }

  async listar(req, res){

    await this.mongoService.connect();
    var jogadores = await this.mongoService.list("jogadores");

    res.set('Content-Type', 'application/json');
    res.send(jogadores);

  }

}
