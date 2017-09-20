// ==================== GET ===================== //
// armazena os objetos json de receitas, aulas, e unidade para ser usado em outros locais
var jsonReceita, jsonAula, jsonPeriodo;

// get da tabela de aulas
$.getJSON('../js/testesJson/testeJsonAula.json', function (jsonObjectAula) {
    jsonAula = jsonObjectAula;

    // get da tabela de receitas
    $.getJSON('../js/testesJson/testeJsonReceitas.json', function (jsonObjectReceita) {
        jsonReceita = jsonObjectReceita;

        // get dos periodos
        $.getJSON('../js/testesJson/testeJsonPeriodo.json', function (jsonObjectPeriodo) {
            jsonPeriodo = jsonObjectPeriodo;

            // geração de botoes
            var botaoExcluir = '<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>';
            var botaoEditar = '<td><button class="btn btn-xs editar" type="button"><i class="fa fa-edit"></i></button></td>';
            var botaoAgendarAula = '<td><button class="botaoAgendarAula" type="button">Agendar Aula</button></td>';
            var botaoAulaConcluida = '<td><button class="botaoAulaConcluida" type="button">Aula Concluida</button></td>';
            var botaoDetalhes = '<td><button type="button" class="btn btn-xs botaoDetalhes"><i class="fa fa-eye"></i></button></td>';

            // roda a lista de aulas
            $.each(jsonObjectAula, function (indexAula, valAula) {

                // conta o numero de receitas na aula
                var countReceitas = Object.keys(valAula.receitas).length;

                // cria a 'tr' de cada aula para ficar em formato de lista
                var htmlList = $('<tr class="id-aula" data-id="' + valAula.id_aula + '"></tr>');

                // cria as 'td' com os valores da aula E joga as 'td' dentro da 'tr' htmlList (<tr><td>  </td></tr>)
                $('<td hidden class="id_aula">' + valAula.id_aula + '</td>').appendTo(htmlList);
                $('<td class="dia_da_aula">' + valAula.data_aula + '</td>').appendTo(htmlList);

                // roda a lista de periodos
                $.each(jsonObjectPeriodo, function (indexPeriodo, valPeriodo) {
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
        })
    })
});

// ==================== Ver Detalhes da Aula ==================== //
$('.aulas').on('click', '.botaoDetalhes', function () {
    // var nomeReceita é usado para converter id_reecita para nome_receita
    var nomeReceita;

    // mostra a modal
    $('#verAula').modal('show');

    // pega a id da aula
    var idAula = $(this).closest('tr').data('id');

    // limpa a tabela das receitas
    $('.receitasQuantidade tr').remove();

    // Header da modal
    $.each(jsonAula, function (indexAula, valAula) {
        if (idAula == valAula.id_aula) {
            var trIdAula = '<tr hidden data-id="' + valAula.id_aula + '"></tr>';
            $('.receitasQuantidade').append(trIdAula);

            var htmlDataAula = '<h4 class="modal-title">Aula do dia ' + valAula.data_aula + '</h4>'
            $('.headerDaModal').html(htmlDataAula);
        }
    })

    // verifica se foi dado get das receitas, caso nao tenha dado ele dará get aqui
    if (typeof jsonReceita === 'undefined') {
        $.getJSON('../js/testesJson/testeJsonReceitas.json', function (jsonObjectReceita) {
            jsonReceita = jsonObjectReceita;
            aulaDetalhe()
        });
    }
    aulaDetalhe()

    function aulaDetalhe() {
        // roda a tabela de aulas
        $.map(jsonAula, function (obj) {
            // pega aula com o id especifico
            if (obj.id_aula == idAula) {
                // roda a tabela de receitas da aula
                $.each(obj.receitas, function (indexAulaReceitas, valueAulaReceitas) {
                    // caso id_receita das duas tabelas sejam iguais, pega o nome_receita
                    $.map(jsonReceita, function (objReceita) {
                        if (valueAulaReceitas.id_receita == objReceita.id_receita) {
                            nomeReceita = objReceita.nome_receita;
                        }
                    })

                    var htmlListReceitas = $('<tr></tr>');
                    $('<td class="id_receita"><a href="#" id="hipertextColor">' + nomeReceita + '</a></td>').appendTo(htmlListReceitas);
                    $('<td class="quantidade_receita">' + valueAulaReceitas.quantidade_receita + '</td>').appendTo(htmlListReceitas);
                    $(htmlListReceitas).appendTo('.receitasQuantidade');
                })
            }
        })
        var htmlButtonArr = [];
        htmlButtonArr.push('<button type="button" class="btn btn-default clonar">Clonar Aula</button>');
        htmlButtonArr.push('<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>');
        $('.rodape').html(htmlButtonArr);
    }
})

// =========== POST PUT =========== //
function jsonPost() {
    var form = $('#form_addAula');

    // pega id da aula (se vazio = POST, se tem algo = PUT)
    var id = $(this).closest('form').find('.id_aula').val();
    if (id == '') {
        var urlData = "http://httpbin.org/post";
    } else {
        var urlData = "http://httpbin.org/post/" + id + "";
    }

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

// =========== MODAL MARCAR COMO AULA AGENDADA =========== //
$('.aulas').on('click', '.botaoAgendarAula', function () {
    // abre modal
    $('#addReceita').modal('show');
    limpaMensagens();

    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

    // seleciona a 'tr' da aula especifica
    var thisTr = $(this).closest('tr');

    // pega a id da aula especifica
    var idAula = thisTr.data('id');

    // cria os botoes add e del
    var htmlNumReceitas = '<input type="text" id="numero_de_receitas" class="form-control" name="numero_receitas" placeholder="Nº de Receitas" value="">';
    var htmlAddIngButton = '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addReceita"><i class="fa fa-plus"></i></button>';

    form_addAula.find('.addIngButton').html(htmlAddIngButton);

    // gera drop down dos periodos
    $.each(jsonPeriodo, function (indexPeriodo, valPeriodo) {
        $('.turno').append($('<option>').text(valPeriodo.descricao).attr(('value'), valPeriodo.id_periodo));
    })

    // roda a lista de aulas e verifica com a id pego na 'tr'
    $.each(jsonAula, function (indexAula, valAula) {
        if (valAula.id_aula == idAula) {
            // header da modal (mostrar o dia da aula)
            var htmlHeader = '<h4 class="modal-title">Confirmar dados da aula ' + valAula.data_aula + '</h4>'
            $('.cabecalho').html(htmlHeader);

            var htmlIdAula = '<input name="id_aula" class="id_aula" hidden value="' + valAula.id_aula + '"></input>';
            var htmlDiaDaAula = '<input type="text" name="data_aula" class="form-control" id="datepicker" value="' + valAula.data_aula + '"></input>';
            var htmlNumAlunos = '<input type="text" class="form-control qtdAlunos" name="numero_de_alunos_projetados" placeholder="Nº de Alunos" value="' + valAula.numero_de_alunos_projetados + '">';

            form_addAula.find('.idAula').html(htmlIdAula);
            form_addAula.find('.data').html(htmlDiaDaAula);
            form_addAula.find('.numAlunos').html(htmlNumAlunos);

            form_addAula.find('.numReceitas').html(htmlNumReceitas);
            chamaDatePicker();

            // esvazia a array para validação da receita (não repetir receita)
            receitaArray.length = 0;

            // garante que a tabela de receitas foi carregada
            if (typeof jsonObjectReceita === 'undefined') {
                $.getJSON('../js/testesJson/testeJsonReceitas.json', function (jsonObjectReceita) {
                    jsonReceita = jsonObjectReceita;
                    // mostraReceitas(idAula) vem do modal-add-editar-aulas.js
                    mostraReceitas(idAula);
                });
            } else {
                mostraReceitas(idAula);
            }
        }
    })

    // cria array de botoes (cancelar e agendar) 
    var htmlButtonArr = [];
    // joga os botoes na array
    htmlButtonArr.push('<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>');
    htmlButtonArr.push('<button type="button" id="agendarButton" class="btn btn-success pull-right">Agendar Aula</button>');
    // imprime a array no rodape (cancelar e agendar)
    $('.rodape').html(htmlButtonArr);
});

// =========== MARCAR AULA COMO AGENDADA =========== //
$('#addReceita').on('click', '#agendarButton', function () {
    // pega id da receita
    var id = $(this).closest('tr').data('id');
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

// =========== MARCAR COMO AULA CONCLUIDA =========== //
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

// =========== DELETE =========== //
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

// ========== CLONAR AULA ========== //
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

    alert(objCloneStringfy)
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