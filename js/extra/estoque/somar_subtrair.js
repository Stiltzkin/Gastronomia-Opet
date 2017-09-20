// ==================== SOMAR ==================== //
$('#lista-ingredientes').on('click', '.addButton', function () {
    // abre a modal
    $('#somar').modal('show');
    limpaMensagens();

    // seleciona a tag 'tr' do ingrediente especifico
    var thisTr = $(this).closest('tr');

    // pega id do ingrediente localizado no html
    var id_ingrediente = thisTr.data('id');

    // limpa o drop down de unidades (para nao ir acrescentando mais lista)
    $('.UnidadeMedida').empty();

    // roda a lista de ingredientes
    $.each(jsonIngrediente, function (indexIngrediente, valIngrediente) {
        // caso id_ingrediente localizado no html seja igual a id_ingrediente do json ingrediente, pega o json desse ingrediente e mostra na tela
        if (id_ingrediente == valIngrediente.id_ingrediente) {
            // cria input do id do ingrediente (para saber qual ingrediente dar o PUT) 'hidden'
            var htmlIdIngrediente = '<input id="idSoma" hidden value="' + valIngrediente.id_ingrediente + '"></input>';

            // cria html para mostrar a quantidade atual do ingrediente em estoque
            var htmlQuantidadeAtual = '<h5>' + valIngrediente.quantidade_estoque_ingrediente + '</h5>';

            // aparecera na header da modal, "Acrescentar + <nome do ingrediente>"
            var htmlNomeIngrediente = '<h4 class="modal-title ">Acrescentar ' + valIngrediente.nome_ingrediente + '</h4>';

            // roda a lista de unidades e joga na classe UnidadeMedida do html (cria o dropdown com json de unidades)
            // NAO SEI COMO FAZER MOSTRAR A LISTA DO QUE IMPORTA (ex: se unidade do ingrediente for 'kg', ter apenas as opçoes 'kg', e 'g')
            $.each(jsonUnidade, function (indexUnidade, valUnidade) {
                $('.UnidadeMedida').append($('<option>').text(valUnidade.descricao_unidade_medida).attr(('value'), valUnidade.id_unidade_medida));

                // se as id de unidade dos json ingrediente e unidade forem iguais, joga a descricao do json unidade desse ingrediente na tela
                if (valUnidade.id_unidade_medida == valIngrediente.unidade_medida_id_unidade_medida) {
                    var htmlUnidadeMedida = '<h5 value="' + valIngrediente.unidade_medida_id_unidade_medida + '">' + valUnidade.descricao_unidade_medida + '</h5>';

                    // deixa selecionado a unidade do ingrediente ao abrir modal
                    $('select[name="unidade_medida_id_unidade_medida"] option[value="' + valIngrediente.unidade_medida_id_unidade_medida + '"]').prop('selected', true);
                    $('#formSomar').find('.unidadeMedida').html(htmlUnidadeMedida);
                }
            })
            // header da modal
            $('.nomeIngredienteHeader').html(htmlNomeIngrediente);

            // joga na modal a id do ingrediente 'hidden' e a quantidade atual
            $('#formSomar').find('.idIngrediente').html(htmlIdIngrediente);
            $('#formSomar').find('.quantidadeAtual').html(htmlQuantidadeAtual);
        }
    })
});

// ========== postAdd() é chamado em validacao-somar-subtrair.js ==========
function postAdd() {
    limpaMensagens();
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var formSoma = $('#formSomar');
    // seleciona o id do ingrediente 'hidden' localizado no html
    var idAdd = $('#idSoma').val();

    $.ajax({
        type: "POST",
        url: "http://httpbin.org/post/" + idAdd + "",
        dataType: "json",
        data: formSoma.serialize(),

        success: function (resJson) {
            $('#mensagens-sucesso-soma').append('Ingrediente acrescentado com SUCESSO!');
        },
        error: function (xhr, error) {
            $('#mensagens-erro-soma').append('Erro ao acrescentar ingrediente.');
        },
    });
}

// ==================== SUBTRAIR ==================== //
$('#lista-ingredientes').on('click', '.subButton', function () {
    // abre a modal
    $('#subtrair').modal('show');
    limpaMensagens();

    //seleciona a 'tr' do ingrediente especifico
    var thisTr = $(this).closest('tr');

    // pega id do ingrediente localizado no html
    var id_ingrediente = thisTr.data('id');

    // limpa o drop down de unidades (para nao ir acrescentando mais lista)
    $('.UnidadeMedida').empty();

    // roda a lista de ingredientes
    $.each(jsonIngrediente, function (indexIngrediente, valIngrediente) {
        // caso id_ingrediente localizado no html seja igual a id_ingrediente do json ingrediente, pega o json desse ingrediente e mostra na tela
        if (id_ingrediente == valIngrediente.id_ingrediente) {

            // cria input do id do ingrediente (para saber qual ingrediente dar o PUT) 'hidden'
            var htmlIdIngrediente = '<input id="idSub" hidden value="' + valIngrediente.id_ingrediente + '"></input>';

            // cria html para mostrar a quantidade atual do ingrediente em estoque
            var htmlQuantidadeAtual = '<h5>' + valIngrediente.quantidade_estoque_ingrediente + '</h5>';

            // aparecera na header da modal, "Subtrair + <nome do ingrediente>"
            var htmlNomeIngrediente = '<h4 class="modal-title ">Subtrair ' + valIngrediente.nome_ingrediente + '</h4>';

            // roda a lista de unidades e joga na classe UnidadeMedida do html (cria o dropdown com json de unidades)
            // NAO SEI COMO FAZER MOSTRAR A LISTA DO QUE IMPORTA (ex: se unidade do ingrediente for 'kg', ter apenas as opçoes 'kg', e 'g')
            $.each(jsonUnidade, function (indexUnidade, valUnidade) {
                $('.UnidadeMedida').append($('<option>').text(valUnidade.descricao_unidade_medida).attr(('value'), valUnidade.id_unidade_medida));

                // se as id de unidade dos json ingrediente e unidade forem iguais, joga a descricao do json unidade desse ingrediente na tela
                if (valUnidade.id_unidade_medida == valIngrediente.unidade_medida_id_unidade_medida) {
                    var htmlUnidadeMedida = '<h5 value="' + valIngrediente.unidade_medida_id_unidade_medida + '">' + valUnidade.descricao_unidade_medida + '</h5>';

                    // deixa selecionado a unidade do ingrediente ao abrir modal
                    $('select[name="unidade_medida_id_unidade_medida"] option[value="' + valIngrediente.unidade_medida_id_unidade_medida + '"]').prop('selected', true);
                    $('#formSubtrair').find('.unidadeMedida').html(htmlUnidadeMedida);
                }
            })

            // header da modal
            $('.nomeIngredienteHeader').html(htmlNomeIngrediente);

            // joga na modal a id do ingrediente 'hidden' e a quantidade atual
            $('#formSubtrair').find('.idIngrediente').html(htmlIdIngrediente);
            $('#formSubtrair').find('.quantidadeAtual').html(htmlQuantidadeAtual);
        }
    })
    // MOTIVO DE DELETAR ESTA NO HTML
});

// ========== postSub() é chamado em validacao-somar-subtrair.js ==========
function postSub() {
    limpaMensagens();

    // seleciona o formulario, vai ser enviado serializado em 'data'
    var formSubtrair = $('#formSubtrair');

    // seleciona o id do ingrediente 'hidden' localizado no html
    var idSub = $('#idSub').val();

    $.ajax({
        type: "POST",
        url: "http://httpbin.org/post/" + idSub + "",
        dataType: "json",
        data: formSoma.serialize(),

        success: function (resJson) {
            $('#mensagens-sucesso-subtrair').append('Ingrediente subtraido com SUCESSO!');
        },
        error: function (xhr, error) {
            $('#mensagens-erro-subtrair').append('Erro ao subtrair ingrediente.');
        },
    });
};