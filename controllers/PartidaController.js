var MongoService = require('../services/MongoService');

module.exports = class PartidaController{

  constructor(){
    this.mongoService = new MongoService();
  }

  async salvarPartida(req, res) {

    await this.mongoService.connect();

    //espera ate q todos os jogadores sejam salvos
    var jogadores = await Promise.all(req.body.jogadores.map(
      nomeJogador => this.salvarJogador(nomeJogador)
    ));

    var equipe1 = {
      jogadores: [jogadores[0]._id, jogadores[1]._id],
      pontos: parseInt(req.body.pontos1)
    };

    var equipe2 = {
      jogadores: [jogadores[2]._id, jogadores[3]._id],
      pontos: parseInt(req.body.pontos2)
    };

    var equipeVencedora;
    var equipePerdedora;

    if(equipe1.pontos > equipe2.pontos){
      equipeVencedora = equipe1;
      equipePerdedora = equipe2;
    }else{
      equipeVencedora = equipe2;
      equipePerdedora = equipe1;
    }

    var partida = {
      equipeVencedora: equipeVencedora,
      equipePerdedora: equipePerdedora,
      datetime: new Date()
    };

    this.mongoService.save("partidas", partida);

    this.mongoService.close();
    res.redirect('/ranking');

  }

  /**
   * Verifica se existe algum jogador com o nome informado,
   * caso exista retorna o mesmo, caso não exista cria um novo
   * e retorna.
   * @param  string  nomeJogador
   * @return {Promise} Promise que resolve com o objeto jogador
   */
  async salvarJogador(nomeJogador) {

    var jogador = await this.mongoService.find(
      "jogadores", {nome: nomeJogador}
    );

    if(jogador){
      return jogador;
    }else{
      let novoJogador = {nome: nomeJogador};
      await this.mongoService.save("jogadores", novoJogador);
      return novoJogador;
    }
  }

  async rankingPorJogador(req, res){

    await this.mongoService.connect();

    var ranking = await this.mongoService.aggregate("partidas", [
      {$unwind: "$equipeVencedora.jogadores"},
      {$lookup: {
          from: "jogadores",
          localField: "equipeVencedora.jogadores",
          foreignField: "_id",
          as: "jogador"
      }},
      {$unwind: "$jogador"},
      {$group: {
          _id: "$jogador._id",
          nome: {$first: "$jogador.nome"},
          pontos: {$sum: "$equipeVencedora.pontos"},
          partidas: {$sum: 1}
      }},
      {$sort: {pontos: -  1}}
    ]);

    res.render('ranking', {ranking: ranking});

  }

}
