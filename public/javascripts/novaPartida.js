"use strict";

(function(){

  $(document).ready(inicializar);

  function inicializar(){

    $("#novaPartida").submit(() => {
      return validarJogadores() && validarPontos();
    });

    inicializarAutocomplete();

  }

  function inicializarAutocomplete(){

    $.get("/jogadores").done(data => {

      var jogadores = data.reduce((accumulator, jogador) => {
        accumulator[jogador.nome] = null;
        return accumulator;;
      }, {});


      $('input[name=jogadores]').autocomplete({
        data: jogadores,
        limit: 20,
        minLength: 0,
      });

    });

  }

  /**
   *  - Os pontos não podem ser iguais
   *  - Ambos os pontos não podem ser maior que 6
   *  - Pelo menos um dos pontos deve ser igual ou maior que 6
   */
  function validarPontos(){
    var p1 = $("#pontos1").val();
    var p2 = $("#pontos2").val();

    if((p1 < 6) == (p2 < 6)){
      Materialize.toast('Pontuação inválida!', 4000);
      return false;
    }else{
      return true;
    }

  }

  /**
   * - Verifica se existe algum nome de jogador duplicado
   */
  function validarJogadores(){

    var qtdJogadores = $("input[name=jogadores]")
      .toArray()
      .map(element => $(element).val())
      .reduce((qtdJogadores, jogador) => {

      if(qtdJogadores.hasOwnProperty(jogador)){
        qtdJogadores[jogador]++;
      }else{
        qtdJogadores[jogador] = 1;
      }

      return qtdJogadores;
    }, {});

    if(Object.values(qtdJogadores).filter(q => q > 1).length > 0){
      Materialize.toast('Jogadores duplicados', 4000);
      return false;
    }else{
      return true;
    }

  }

})();
