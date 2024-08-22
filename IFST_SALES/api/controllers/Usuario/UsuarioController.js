// api/controllers/UserController.js

async function captureUserInfo(req) {
  const userId = req.session.userId;
  let fullName = req.session.fullName;

  if (!userId) {
    throw new Error('ID de usuário ausente na sessão');
  }

  if (!fullName) {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    fullName = user.fullName;
    req.session.fullName = fullName;
  }

  return { userId, fullName };
}

module.exports = {
  listar: async function (req, res) {
    try {
      const usuarios = await User.find().populate('perfil');
      const perfis = await Perfil.find();
      return res.view('pages/usuario/listar', { usuarios, perfis });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao listar os usuários.',
        error: err.message
      });
    }
  },

  buscar: async function (req, res) {
    try {
      const usuario = await User.findOne({ id: req.params.id }).populate('perfil');
      if (!usuario) {
        return res.notFound({
          message: 'Usuário não encontrado.'
        });
      }
      return res.json(usuario);
    } catch (err) {
      return res.serverError({
        message: 'Erro ao buscar o usuário.',
        error: err.message
      });
    }
  },

   criar: async function (req, res) {
    try {
      const { emailAddress, password, fullName, perfil } = req.body;

      // Converte o endereço de e-mail para letras minúsculas para garantir a unicidade
      const novoEmail = emailAddress.toLowerCase();

      // Constrói os dados para o novo registro de usuário e salva no banco de dados
      // (Use `fetch` para recuperar o novo ID para que possamos usá-lo abaixo)
      const novoUsuario = await User.create(_.extend({
        fullName,
        emailAddress: novoEmail,
        password: await sails.helpers.passwords.hashPassword(password),
        perfil,
        tosAcceptedByIp: req.ip, // Armazena o IP de onde os termos de serviço foram aceitos
      }, sails.config.custom.verifyEmailAddresses ? {
        emailProofToken: await sails.helpers.strings.random('url-friendly'),
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailStatus: 'unconfirmed'
      } : {}))
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();

      // Se os recursos de faturamento estiverem habilitados, salva um novo cliente na API do Stripe
      // E persiste o ID do cliente do Stripe no banco de dados
      if (sails.config.custom.enableBillingFeatures) {
        let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
          emailAddress: novoEmail
        }).timeout(5000).retry();
        await User.updateOne({ id: novoUsuario.id })
          .set({ stripeCustomerId });
      }

      // Armazena o novo ID de usuário na sessão
      req.session.userId = novoUsuario.id;

      // Em caso de sessão existente (por exemplo, se permitimos que usuários vão à página de inscrição
      // quando já estão logados), transmite uma mensagem que podemos exibir em outras abas abertas.
      if (sails.hooks.sockets) {
        await sails.helpers.broadcastSessionChange(req);
      }

      // Se o recurso de verificação de e-mail estiver habilitado, envia o e-mail de confirmação
      if (sails.config.custom.verifyEmailAddresses) {
        await sails.helpers.sendTemplateEmail.with({
          to: novoEmail,
          subject: 'Por favor, confirme sua conta',
          template: 'email-verify-account',
          templateData: {
            fullName,
            token: novoUsuario.emailProofToken
          }
        });
      } else {
        sails.log.info('Pulando a verificação de nova conta por e-mail... (pois `verifyEmailAddresses` está desativado)');
      }

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        usuario: novoUsuario
      });

    } catch (err) {
      return res.serverError({
        message: 'Erro ao criar o usuário.',
        error: err.message
      });
    }
  },

  atualizar: async function (req, res) {
    try {
      const { emailAddress, password, fullName, perfil } = req.body;
      const userIdToUpdate = req.params.id;

      // Converte o endereço de e-mail para letras minúsculas para garantir a unicidade
      const novoEmail = emailAddress.toLowerCase();

      // Constrói os dados para atualizar o registro do usuário e salva no banco de dados
      // Se a senha for fornecida, ela será atualizada
      const dadosAtualizados = {
        fullName,
        emailAddress: novoEmail,
        perfil,
      };

      if (password) {
        dadosAtualizados.password = await sails.helpers.passwords.hashPassword(password);
      }

      const usuarioAtualizado = await User.updateOne({ id: userIdToUpdate })
        .set(_.extend(dadosAtualizados, sails.config.custom.verifyEmailAddresses ? {
          emailProofToken: await sails.helpers.strings.random('url-friendly'),
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: 'unconfirmed'
        } : {}))
        .intercept('E_UNIQUE', 'emailAlreadyInUse')
        .intercept({ name: 'UsageError' }, 'invalid')
        .fetch();

      if (!usuarioAtualizado) {
        return res.notFound({
          message: 'Usuário não encontrado.',
          type: 'NotFoundError'
        });
      }

      // Se os recursos de faturamento estiverem habilitados, atualiza o cliente na API do Stripe
      if (sails.config.custom.enableBillingFeatures) {
        await sails.helpers.stripe.updateBillingInfo.with({
          stripeCustomerId: usuarioAtualizado.stripeCustomerId,
          emailAddress: novoEmail
        }).timeout(5000).retry();
      }

      // Se o recurso de verificação de e-mail estiver habilitado e o email foi alterado, envia o e-mail de confirmação
      if (sails.config.custom.verifyEmailAddresses && emailAddress !== usuarioAtualizado.emailAddress) {
        await sails.helpers.sendTemplateEmail.with({
          to: novoEmail,
          subject: 'Por favor, confirme sua nova conta de e-mail',
          template: 'email-verify-account',
          templateData: {
            fullName,
            token: usuarioAtualizado.emailProofToken
          }
        });
      } else {
        sails.log.info('Pulando a verificação de conta de e-mail... (pois `verifyEmailAddresses` está desativado ou o email não foi alterado)');
      }

      return res.json({
        message: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado
      });

    } catch (err) {
      return res.serverError({
        message: 'Erro ao atualizar o usuário.',
        error: err.message
      });
    }
  },


  deletar: async function (req, res) {
    try {
      const userIdToDelete = req.params.id;

      const usuarioDeletado = await User.destroyOne({ id: userIdToDelete });

      if (!usuarioDeletado) {
        return res.notFound({
          message: 'Usuário não encontrado.',
          type: 'NotFoundError'
        });
      }

      return res.json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (err) {
      return res.serverError({
        message: 'Erro ao deletar o usuário.',
        error: err.message
      });
    }
  }
};
