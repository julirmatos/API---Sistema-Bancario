const { contas, saques, depositos, transferencias } = require("../dados/banco");

let numero = 1;

const listarContas = async (req, res) => {
  return res.status(200).json(contas);
};

const criarConta = async (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const mensagem = validarUsuario(
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  );
  if (mensagem) {
    return res.status(400).json({ mensagem }); //
  }

  try {
    const verificaCPF = contas.find((pessoa) => {
      return pessoa.usuario.cpf === cpf;
    });
    const verificaEmail = contas.find((pessoa) => {
      return pessoa.usuario.email === email;
    });

    if (verificaCPF) {
      return res.status(400).json({ mensagem: "CPF informado já existe!" });
    }
    if (verificaEmail) {
      return res.status(400).json({ mensagem: "Email informado já existe!" });
    }
    const contaNova = {
      numero,
      saldo: 0,
      usuario: { nome, cpf, data_nascimento, telefone, email, senha },
    };
    numero++;
    contas.push(contaNova);

    return res.status(201).send();
  } catch (error) {
    return res.status(500).json({ mensagem: " erro interno no servidor" });
  }
};

const atualizaConta = async (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  const mensagem = validarUsuario(
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  );
  if (mensagem) {
    return res.status(400).json({ mensagem }); //
  }

  try {
    const contaValida = contas.find((conta) => {
      return conta.numero === Number(numeroConta);
    });

    if (!contaValida) {
      return res.status(404).json({ mensagem: "Número de conta inexistente!" });
    }

    const verificaCPF = contas.find((pessoa) => {
      return pessoa.usuario.cpf === Number(cpf);
    });
    const verificaEmail = contas.find((pessoa) => {
      return pessoa.usuario.email === email;
    });

    if (verificaCPF) {
      return res.status(400).json({ mensagem: "CPF informado já existe!" });
    }
    if (verificaEmail) {
      return res.status(400).json({ mensagem: "Email informado já existe!" });
    }

    contaValida.usuario.nome = nome;
    contaValida.usuario.cpf = cpf;
    contaValida.usuario.data_nascimento = data_nascimento;
    contaValida.usuario.telefone = telefone;
    contaValida.usuario.email = email;
    contaValida.usuario.senha = senha;

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: " erro interno no servidor" });
  }
};

const excluirConta = async (req, res) => {
  const { numeroConta } = req.params;
  const contaValida = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });

  if (!contaValida) {
    return res.status(404).json({ mensagem: "Número da conta Inválida!" });
  }
  if (contaValida.saldo !== 0) {
    return res.status(400).json({
      mensagem:
        "A conta só pode ser removida" + " se o saldo for igual a zero!",
    });
  }
  try {
    const indiceConta = contas.findIndex((conta) => {
      return conta.numero === Number(numeroConta);
    });

    contas.splice(indiceConta, 1);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: " erro interno no servidor" });
  }
};

const consultarSaldo = async (req, res) => {
  const { numero_conta, senha } = req.query;

  const verificaConta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!verificaConta) {
    return res
      .status(404)
      .json({ mensagem: "Conta não encontrada ou inexistente!" });
  }
  if (verificaConta.usuario.senha !== String(senha)) {
    return res.status(403).json({ mensagem: "Senha Inválida!" });
  }
  return res.status(200).json({ saldo: verificaConta.saldo });
};

const consultarExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;
  const verificaConta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!verificaConta) {
    return res.status(404).json({ mensagem: "Conta não encontrada!" });
  }

  if (verificaConta.usuario.senha !== String(senha)) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }
  try {
    const verificaDepositos = depositos.filter(
      (deposito) => deposito.numero_conta === numero_conta
    );

    const verificaSaques = saques.filter(
      (saque) => saque.numero_conta === numero_conta
    );

    const verificaTransferenciasEnviadas = transferencias.filter(
      (transferencia) => transferencia.numero_conta_origem === numero_conta
    );

    const verificaTransferenciasRecebidas = transferencias.filter(
      (transferencia) => transferencia.numero_conta_destino !== numero_conta
    );

    return res.status(200).json({
      depositos: verificaDepositos,
      saques: verificaSaques,
      transferenciasEnviadas: verificaTransferenciasEnviadas,
      transferenciasRecebidas: verificaTransferenciasRecebidas,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: " erro interno no servidor" });
  }
};

module.exports = {
  listarContas,
  criarConta,
  atualizaConta,
  excluirConta,
  consultarSaldo,
  consultarExtrato,
};

const validarUsuario = (nome, cpf, data_nascimento, telefone, email, senha) => {
  if (!nome || nome === " ") {
    return "O nome é obrigatório";
  }

  if (!cpf || cpf === " ") {
    return "O Cpf é obrigatório";
  }

  if (!data_nascimento || data_nascimento === " ") {
    return "A data de nascimento é obrigatório";
  }

  if (!telefone || telefone === " ") {
    return "O telefone é obrigatório";
  }

  if (!email || email === " ") {
    return "O email é obrigatório";
  }

  if (!senha || senha === " ") {
    return "O email é obrigatório";
  }
  return null;
};
