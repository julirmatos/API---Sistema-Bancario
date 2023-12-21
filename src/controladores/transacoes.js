const { contas, depositos, saques, transferencias } = require("../dados/banco");
const depositar = async (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios" });
  }

  const indexConta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!indexConta) {
    return res.status(404).json({ mensagem: "Número de conta inexistente!" });
  }
  if (valor <= 0) {
    return res.status(400).json({
      mensagem: "Não permitimos depósitos de valores negativos ou nulos",
    });
  }
  indexConta.saldo += valor; // atualiza o valor

  // Cria o registro do depósito
  const registroDeposito = {
    data: new Date().toLocaleString(),
    numero_conta: numero_conta,
    valor: valor,
  };

  depositos.push(registroDeposito);

  return res.status(204).send();
};

const sacar = async (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  if (!numero_conta || !valor || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são de preenchimento obrigatório" });
  }

  const indexConta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  if (!indexConta) {
    return res.status(404).json({ mensagem: "Número de conta inexistente!" });
  }

  if (indexConta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  if (valor > indexConta.saldo) {
    return res
      .status(422)
      .json({ mensagem: "Saldo insuficiente para o saque!" });
  }
  if (valor < 0) {
    return res
      .status(422)
      .json({ mensagem: "Valor não pode ser menor que zero!" });
  }

  indexConta.saldo -= valor; // Atualiza o saldo corretamente

  // Cria o registro do saque
  const registraSaque = {
    data: new Date().toLocaleString(),
    numero_conta: numero_conta,
    valor: valor,
  };

  saques.push(registraSaque);

  return res.status(200).send();
};

const transferir = async (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Os campos são de preenchimento obrigatório!" });
  }

  const indexContaOrigem = contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });

  if (!indexContaOrigem) {
    return res
      .status(400)
      .json({ mensagem: "Número de conta origem inexistente!" });
  }

  const indexContaDestino = contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });

  if (!indexContaDestino) {
    return res
      .status(404)
      .json({ mensagem: "Número de conta destino inexistente!" });
  }

  if (indexContaOrigem.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  if (valor > indexContaOrigem.saldo) {
    return res.status(422).json({ mensagem: "Saldo insuficiente!" });
  }

  // Atualiza os saldos
  indexContaOrigem.saldo -= valor;
  indexContaDestino.saldo += valor;

  // Cria o registro da transferência
  const registraTransferencia = {
    data: new Date().toLocaleString(),
    numero_conta_origem: numero_conta_origem,
    numero_conta_destino: numero_conta_destino,
    valor: valor,
  };

  transferencias.push(registraTransferencia);

  return res.status(200).send();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
