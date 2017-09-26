// ==================== GET ===================== //
$(document).ready(function () {
    // armazena os objetos json de receitas, aulas, e unidade para ser usado em outros locais
    window.jsonReceita;
    window.jsonAula;
    window.jsonPeriodo;

    // verifica se foi dado get das receitas, aulas e periodo, caso nao tenha dado ele dará get aqui
    if (typeof jsonAula === 'undefined' || typeof jsonReceita === 'undefined' || typeof jsonPeriodo === 'undefined') {
        // get da tabela de aulas
        $.getJSON('../js/testesJson/testeJsonAula.json', function (jsonObjectAula) {
            jsonAula = jsonObjectAula;
            // get da tabela de receitas
            $.getJSON('../js/testesJson/testeJsonReceitas.json', function (jsonObjectReceita) {
                jsonReceita = jsonObjectReceita;
                // get da tabela de periodo
                $.getJSON('../js/testesJson/testeJsonPeriodo.json', function (jsonObjectPeriodo) {
                    jsonPeriodo = jsonObjectPeriodo;
                    getTabela(jsonAula, jsonReceita, jsonPeriodo);
                })
            })
        })
    } else {
        getTabela(jsonAula, jsonReceita, jsonPeriodo);
    }
})

function getTabela(jsonAula, jsonReceita, jsonPeriodo) {
    // geração de botoes
    var botaoExcluir = '<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>';
    var botaoEditar = '<td><button class="btn btn-xs editar" type="button"><i class="fa fa-edit"></i></button></td>';
    var botaoAgendarAula = '<td><button class="botaoAgendarAula" type="button">Agendar Aula</button></td>';
    var botaoAulaConcluida = '<td><button class="botaoAulaConcluida" type="button">Aula Concluida</button></td>';
    var botaoDetalhes = '<td><button type="button" class="btn btn-xs botaoDetalhes"><i class="fa fa-eye"></i></button></td>';

    // roda a lista de aulas
    $.each(jsonAula, function (indexAula, valAula) {

        // conta o numero de receitas na aula
        var countReceitas = Object.keys(valAula.receitas).length;

        // cria a 'tr' de cada aula para ficar em formato de lista
        var htmlList = $('<tr class="id-aula" data-id="' + valAula.id_aula + '"></tr>');

        // cria as 'td' com os valores da aula E joga as 'td' dentro da 'tr' htmlList (<tr><td>  </td></tr>)
        $('<td hidden class="id_aula">' + valAula.id_aula + '</td>').appendTo(htmlList);
        $('<td class="dia_da_aula">' + valAula.data_aula + '</td>').appendTo(htmlList);

        // roda a lista de periodos
        $.each(jsonPeriodo, function (indexPeriodo, valPeriodo) {
            // compara as id da key 'turno' da taebla aula com a key 'id_periodo' da tabela periodo, se forem iguais pega a 'descricao' da tabela periodo para mostrar na tela
            if (valAula.periodo_aula == valPeriodo.id_periodo) {
                $('<td class="periodo">' + valPeriodo.descricao + '</td>').appendTo(htmlList);
            }
        })

        $('<td class="num_receitas">' + countReceitas + '</td>').appendTo(htmlList);
        $('<td class="num_alunos">' + valAula.numero_de_alunos_projetados + '</td>').appendTo(htmlList);

        // joga os botoes detalhes e excluir dentro da 'tr'
        $(botaoDetalhes).appendTo(htmlList);
        $(botaoExcluir).appendTo(htmlList);

        // se aula_agendada = false, a aula NAO ESTA agendada
        if (valAula.aula_agendada == "false") {
            $(botaoEditar).appendTo(htmlList);
            $(botaoAgendarAula).appendTo(htmlList);
            $(htmlList).appendTo('.listaAulasPlanejadas');
        }
        // se aula_agendada = true, aula ESTA planejada
        if (valAula.aula_agendada == "true" && valAula.aula_concluida == "false") {
            $(botaoAulaConcluida).appendTo(htmlList);
            $(htmlList).appendTo('.listaAulasAgendadas');
        }
        // se aula_agendada = true E se aula_concluida = true, aula ESTA CONCLUIDA
        if (valAula.aula_agendada == "true" && valAula.aula_concluida == "true") {
            // .aulaConcluidaList esta localizado em aulas-concluidas.html
            $(htmlList).appendTo('.aulaConcluidaList');
        }
    })
}

// ===================== POST PUT ===================== //
// chamado na validacao_receitas_da_aula.js
function jsonPost() {
    var form = $('#form_addAula');

    // pega id da aula (se vazio = POST, se tem algo = PUT)
    var id = $(this).closest('form').find('.id_aula').val();

    var url = "http://localhost:3000/receitas";
    if (id)
        url += "/" + id;

    $.ajax({
        type: "POST",
        url: urlData,
        dataType: "json",
        data: form.serialize(),
        success: function () {
            $('#mensagens-sucesso').append('DEU CERTO PORRA!!');
        },
        error: function () {
            $('#mensagens-erro').append('AFFE CAGO!!');
        },
    });
};

// ===================== MARCAR AULA COMO AGENDADA ===================== //
$('#addReceita').on('click', '#agendarButton', function () {
    // pega id da receita
    var id = $(this).closest('#form_addAula').find('.id_aula').data('id');
    var urlData = "http://httpbin.org/post/" + id + "";

    $.ajax(urlData, {
        type: 'POST',
        data: {
            aula_agendada: 'true'
        },
        dataType: 'json',
        success: function () {
            swal({
                    title: "Aula Agendada com SUCESSO!",
                    type: "success",
                }),
                $('#addReceita').modal('hide');
        },
        error: function () {
            swal({
                title: "Problemas para Agendar a aula",
                type: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#DD6B55",
            })
        }
    })
})

// ===================== MARCAR COMO AULA CONCLUIDA ===================== //
$('.aulas').on('click', '.botaoAulaConcluida', function () {
    // pega id da receita
    var id = $(this).closest('tr').data('id');
    var urlData = "http://httpbin.org/post/" + id + "";

    swal({
            title: "Marcar esta aula como Concluida?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            closeOnConfirm: false,
        },
        function () {
            $.ajax(urlData, {
                type: 'POST',
                data: {
                    aula_concluida: 'true'
                },
                dataType: 'json',
                success: function () {
                    swal({
                            title: "Aula Concluida!",
                            type: "success",
                        }),
                        $(thisTr).remove();
                },
                error: function () {
                    swal({
                        title: "Problemas para concluir a aula",
                        type: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#DD6B55",
                    })
                },
            })
        }
    );
});

// ===================== DELETE ===================== //
$('.aulas').on('click', '.excluir', function () {
    var thisTr = $(this).closest('tr');
    var idData = thisTr.data('id');
    swal({
            title: "Tem certeza que deseja deletar esta aula?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false,
        },
        function () {
            $.ajax('http://httpbin.org/delete', {
                type: 'DELETE',
                data: {
                    "id_aula": idData
                },
                dataType: 'json',
                success: function () {
                    swal({
                            title: "Aula removido com sucesso!",
                            type: "success",
                        }),
                        $(thisTr).remove();
                },
                error: function () {
                    swal({
                        title: "Problemas ao remover a aula",
                        type: 'error',
                    })
                },
            })
        }
    );
});

// ==================== CLONAR AULA ==================== //
$('#verAula').on('click', '.clonar', function () {
    // xunxo para pegar a id da aula
    var idAula = $(this).closest('.modal-body').find('.receitasQuantidade').find('tr').data('id');
    $.each(jsonAula, function (indexAula, valueAula) {
        if (valueAula.id_aula == idAula) {
            var objClone = new Object();
            objClone.id_aula = '';
            objClone.data_aula = '';
            objClone.periodo_aula = valueAula.periodo_aula;
            objClone.aula_concluida = 'false';
            objClone.aula_agendada = 'false';
            objClone.numero_de_alunos_projetados = valueAula.numero_de_alunos_projetados;
            objClone.receitas = [];

            $.each(valueAula.receitas, function (indexAulaReceitas, valueAulaReceitas) {
                objClone.receitas.push(valueAulaReceitas);
            })
            var objCloneStringfy = JSON.stringify(objClone);
            jsonClone(objCloneStringfy);

        }
    })
})

function jsonClone(objCloneStringfy) {
    swal({
            title: "Clonar esta aula?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Clonar",
            closeOnConfirm: false,
        },
        function () {
            $.ajax('http://httpbin.org/post', {
                type: 'POST',
                data: objCloneStringfy,
                dataType: 'json',
                success: function () {
                    swal({
                        title: 'Aula clonado com sucesso!',
                        text: 'Clone está localizado em Planejar Aulas',
                        type: 'success',
                        confirmButtonText: "Ok",
                    });
                },
                error: function () {
                    swal({
                        title: "Problemas ao clonar aula",
                        type: "warning",
                        confirmButtonText: "Vish Maria",
                        confirmButtonColor: "#DD6B55",
                    })
                },
            })
        }
    );
}