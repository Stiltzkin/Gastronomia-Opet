$(document).ready(function () {
    // garante que a tabela de aulas foi carregada
    if (typeof jsonAula === 'undefined') {
        $.getJSON('../js/testesJson/testeJsonAula.json', function (jsonObjectAula) {
            window.jsonAula = jsonObjectAula;
            calculaValores();
        })
    } else {
        calculaValores();
    }
})

function calculaValores() {
    var countAulasCriadas, countAulasAgendadas;
    // contadores
    var j = 0;
    var i = 0;

    $.each(jsonAula, function (indexAula, valAula) {
        // conta o numero de aulas criadas

        if (valAula.aula_agendada == "false") {
            j++
            htmlAulasCriadas = '<h3>' + j + '</h3>';
        }
    })

    $.each(jsonAula, function (indexAula, valAula) {
        // conta o numero de aulas agendadas
        if (valAula.aula_agendada == "true" && valAula.aula_concluida == "false") {
            i++
            htmlAulasAgendadas = '<h3>' + i + '</h3>';
        }
    })
    $('.numAulasCriadas').html(htmlAulasCriadas + "<p>Total de Aulas Criadas</p>");
    $('.numAulasAgendadas').html(htmlAulasAgendadas + "<p>Total de Aulas Agendadas</p>");
}