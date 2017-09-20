// ========== VALIDAÇAO de ADICIONAR e EDITAR INGREDIENTE ========== //
$('#adicionar-ingrediente').on('click', function () {

    limpaMensagens();
    var ingrediente = obtemIngredienteDoFormulario();

    var erros = validaIngrediente(ingrediente);
    if (erros.length > 0) {
        exibeMensagensDeErro(erros);
        return;
    }
    postJson();
});

function obtemIngredienteDoFormulario() {
    var nome = document.getElementById("nome_ingrediente").value;
    var qtd = document.getElementById("quantidade_calorica").value;
    var aproveitamento = document.getElementById("aproveitamento").value;
    var ingrediente = {
        nome: nome,
        calorias: qtd,
        aproveitamento: aproveitamento
    };
    return ingrediente;
}

function validaIngrediente(ingrediente) {
    var erros = [];

    if (ingrediente.nome.length == 0) {
        erros.push("O NOME do ingrediente não pode estar em branco");
    }
    if (ingrediente.calorias.length == 0) {
        erros.push("A QUANTIDADE CALORICA não pode estar em branco");
    }
    if (ingrediente.aproveitamento.length == 0) {
        erros.push("O APROVEITAMENTO não pode estar em branco");
    }
    return erros;
}

function exibeMensagensDeErro(erros) {
    var ul = document.querySelector("#mensagens-erro");

    ul.innerHTML = "";

    erros.forEach(function (erro) {
        var li = document.createElement("li");
        li.textContent = erro;
        ul.appendChild(li);
    });
}