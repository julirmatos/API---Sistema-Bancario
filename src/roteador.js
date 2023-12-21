const express = require("express");

const {
  listarContas,
  criarConta,
  atualizaConta,
  excluirConta,
  consultarSaldo,
  consultarExtrato,
} = require("./controladores/banco");

const { sacar, transferir, depositar } = require("./controladores/transacoes");

const roteador = express();

roteador.get("/contas", listarContas);
roteador.post("/contas", criarConta);
roteador.put("/contas/:numeroConta/usuario", atualizaConta);
roteador.delete("/contas/:numeroConta", excluirConta);
roteador.get("/contas/saldo", consultarSaldo);
roteador.get("/contas/extrato", consultarExtrato);
roteador.post("/transacoes/saque", sacar);
roteador.post("/transacoes/transferir", transferir);
roteador.post("/transacoes/depositar", depositar);

module.exports = roteador;
