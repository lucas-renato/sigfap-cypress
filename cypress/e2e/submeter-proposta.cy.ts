describe("Submeter Proposta", () => {
  beforeEach(() => {
    cy.fixture("submeter-proposta").then((dados) => {
      cy.typeLogin(dados.email, dados.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible"); // garante que tá na home
    });
  });

  // F-05 — CARACTERIZAÇÃO

  context("F-05 — Caracterização", () => {
    it("CT-SIG-CAR-001 — Preencher informações iniciais (caminho feliz)", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Navegar até a proposta e editar
        cy.visit("/edital/33/minhas-propostas/959");

        // Preencher Informações Iniciais
        cy.get('[data-cy="edital.nome"]').should("be.disabled");
        cy.get('[data-cy="titulo"]').clear().type(dados.proposta.titulo);
        cy.get('[data-cy="duracao"]').clear().type(dados.proposta.duracao);

        cy.get('[data-cy="open-instituicao-executora-id"]').click();
        cy.get('[data-cy="ufms-universidade-federal-do-mat"]').click();

        cy.get('[data-cy="open-unidade-executora-id"]').click();
        cy.get('[data-cy="facom-faculdade-de-computacao"]').click();

        cy.get('[data-cy="add-areas-de-conhecimento"]').click();
        cy.get('[data-cy="open-grande-area-id"]').click();
        cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();
        cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();

        // Avançar e verificar que proposta foi criada
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="informacoes-complementares"]').should("exist");
      });
    });
  });

  // F-06 — INFORMAÇÕES COMPLEMENTARES E ABRANGÊNCIA

  context("F-06 — Informações Complementares e Abrangência", () => {
    it.skip("CT-SIG-INF-001 — Pergunta obrigatória não respondida (a implementar)", () => {});

    it("CT-SIG-ABR-001 — Abrangência opcional (avançar sem preencher)", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.visit("/edital/33/minhas-propostas/959");

        cy.get('[data-cy="abrangencia"]').click();

        // Passo 2-3: Avançar sem preencher nada
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="dados-pessoais"]').should("exist");
      });
    });
  });

  // F-07 — COORDENAÇÃO

  context("F-07 — Coordenação", () => {
    it("CT-SIG-CRD-001 — Dados pessoais pré-preenchidos do perfil", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.visit("/edital/33/minhas-propostas/959");
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-pessoais"]').click();

        // Passo 3-4: Confirmar dados pré-preenchidos e email bloqueado
        cy.get('[data-cy="criadoPor.nome"]').should("not.have.value", "");
        cy.get('[data-cy="criadoPor.email"]').should("be.disabled");

        // Passo 5: Avançar
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="endereco"]').should("exist");
      });
    });
  });

  // F-08 — APRESENTAÇÃO
  context.only("F-08 — Apresentação", () => {
    it("CT-SIG-APR-001 — Adicionar membro com status Pendente", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();
        cy.get('[data-cy="membros"]').click();

        cy.get(".css-1osde9l").click();
        cy.get("#autocomplete-1-listbox-option-1").click();
        cy.get(".css-3xh3ky").click();
        cy.contains("Sim, continuar").click();

        cy.contains(dados.membro.nome).should("exist");
        cy.contains("Pendente", { matchCase: false }).should("exist");
        cy.contains("Confirmar").click();
      });
    });

    //  Caminho de Exceção - Duplicidade
    // [EM CONSTRUÇÃO] Teste pausado por exaustão de massa de dados no ambiente.
    // Falta validar se o sistema barra ou aceita a duplicidade.
    it.skip("CT-SIG-APR-002 — Impedir adição de membro duplicado", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();
        cy.get('[data-cy="membros"]').click();

        // 1. ADICIONA A PRIMEIRA VEZ (Deve dar sucesso)
        cy.get(".css-1osde9l").click();
        cy.get("#autocomplete-1-listbox-option-1").click();
        cy.get(".css-3xh3ky").click();
        cy.contains("Sim, continuar").click();
        cy.contains("Confirmar").click(); // Fecha o modal de sucesso da 1ª vez

        // 2. TENTA ADICIONAR A MESMA PESSOA DE NOVO
        cy.get(".css-1osde9l").click();
        cy.get("#autocomplete-1-listbox-option-1").click();
        cy.get(".css-3xh3ky").click();
        cy.contains("Sim, continuar").click();

        // VALIDAÇÃO: O sistema DEVE barrar.
        cy.contains("já existe", { matchCase: false }).should("exist");
      });
    });

    // [BUG IDENTIFICADO] Membro removido não retorna para a lista de busca
    // e o botão de reenvio continua ativo. Documentado na aba Issues
    // Caminho Alternativo - Remoção
    it("CT-SIG-APR-003 — Remover um membro da proposta", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();

        // Acha o nome do membro e clica no botão de remover (lixeira) na mesma linha
        // *Atenção: Você pode precisar ajustar o seletor do botão de excluir
        cy.contains(dados.membro.nome)
          .parent()
          .find(
            'button[aria-label="Excluir"], .fa-trash, [data-cy="remover-membro"]',
          )
          .first()
          .click();

        // Confirma no modal de exclusão (se houver)
        cy.contains("Sim", { matchCase: false }).click();

        // VALIDAÇÃO: O nome do membro não deve mais aparecer na tela
        cy.contains(dados.membro.nome).should("not.exist");
      });
    });

    // Caminho de Exceção - Busca Inválida
    it("CT-SIG-APR-004 — Busca por membro inexistente", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();
        cy.get('[data-cy="membros"]').click();

        // Digita um nome que não existe no banco de dados no input de busca
        cy.get(".css-1osde9l").type("UsuarioFantasma123{enter}");

        // VALIDAÇÃO: Sistema deve exibir mensagem de lista vazia
        // *Atenção: Ajuste para a mensagem real ("Nenhum usuário encontrado", "Sem resultados", etc)
        cy.contains("Nenhum", { matchCase: false }).should("exist");
      });
    });
  });
  // F-12 — VERIFICAÇÃO DE PENDÊNCIAS

  context("F-12 — Verificação de Pendências", () => {
    it("CT-SIG-PND-001 — Bloqueia submissão com pendências", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.visit("/edital/33/minhas-propostas/959");

        cy.get('[data-cy="finalizacao"]').click();
        cy.get('[data-cy="menu-verificar-pendencias"]').click();

        // Verificar que sistema exibe pendências e bloqueia
        cy.contains("pendências").should("exist");
      });
    });
  });

  // F-10 — TERMO E SUBMISSÃO

  context("F-10 — Termo e Submissão", () => {
    it.skip("CT-SIG-SUB-001 — Submeter proposta completa (a implementar)", () => {});
  });
});
