describe("Submeter Proposta", () => {
  beforeEach(() => {
    cy.fixture("submeter-proposta").then((dados) => {
      cy.typeLogin(dados.email, dados.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
    });
  });

  function navegarParaProposta(dados: any) {
    cy.get('[data-cy="projetos-ver-mais"]').click();
    cy.contains("Filtrar").click();
    cy.get('[data-cy="filters.protocolo"]', { timeout: 10000 }).type(
      dados.proposta.protocolo,
    );
    cy.contains("Aplicar Filtros").click();
    cy.contains(dados.proposta.protocolo, { timeout: 10000 }).should("exist");
    cy.contains(dados.proposta.titulo)
      .parent()
      .parent()
      .parent()
      .find("button")
      .eq(1)
      .click();
  }
  // F-05 — CARACTERIZAÇÃO

  context("F-05 — Caracterização", () => {
    it("CT-SIG-CAR-001 — Preencher informações iniciais (caminho feliz)", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Passo 1-3: Navegar até o edital pela lista de editais abertos
        cy.intercept("GET", "/api/edital*").as("editalList");
        cy.get('[data-cy="editais-ver-mais"]').click();
        cy.wait("@editalList");
        cy.contains("Edital 2026-0001 Sig Cypress", { timeout: 10000 })
          .closest("div")
          .find("button")
          .click();

        // Passo 4: Verificar edital e clicar em Criar Proposta
        cy.contains("2026-0001 Sig Cypress").should("exist");
        cy.get('[data-cy="criar-proposta"]', { timeout: 10000 }).click();

        // Passo 5: Tratar modal (proposta já existe) e navegar pra edição
        cy.contains("Confirmar").click();
        cy.get('[data-cy="breadcrumb-home"]').click();
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.contains("Filtrar").click();
        cy.get('[data-cy="filters.protocolo"]', { timeout: 10000 }).type(
          dados.proposta.protocolo,
        );
        cy.contains("Aplicar Filtros").click();
        cy.contains(dados.proposta.protocolo, { timeout: 10000 }).should(
          "exist",
        );
        cy.contains(dados.proposta.titulo)
          .parent()
          .parent()
          .parent()
          .find("button")
          .eq(1)
          .click();

        // Preencher Informações Iniciais
        cy.get('[data-cy="titulo"]', { timeout: 10000 })
          .clear()
          .type(dados.proposta.titulo);
        cy.get('[data-cy="duracao"]').clear().type(dados.proposta.duracao);

        cy.get('[data-cy="open-instituicao-executora-id"]').click();
        cy.get(`[data-cy="${dados.proposta.instituicaoExecutoraId}"]`).click();

        cy.get('[data-cy="open-unidade-executora-id"]').click();
        cy.get(`[data-cy="${dados.proposta.unidadeExecutoraId}"]`).click();

        cy.get('[data-cy="add-areas-de-conhecimento"]').click();
        cy.get('[data-cy="open-grande-area-id"]').click();
        cy.get(`[data-cy="${dados.proposta.grandeAreaId}"]`).click();
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
        navegarParaProposta(dados);

        cy.get('[data-cy="abrangencia"]').click();

        // Passo 2-3: Avançar sem preencher nada
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="coordenacao"]').should("exist");
      });
    });
  });

  // F-07 — COORDENAÇÃO

  context("F-07 — Coordenação", () => {
    it("CT-SIG-CRD-001 — Dados pessoais pré-preenchidos do perfil", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-pessoais"]').click();

        // Confirmar dados pré-preenchidos e email bloqueado
        cy.get('[data-cy="criadoPor.nome"]').should("not.have.value", "");
        cy.get('[data-cy="criadoPor.email"]').should("be.disabled");
        cy.get('[data-cy="criadoPor.dataNascimento"]').should(
          "not.have.value",
          "",
        );
        cy.get('[data-cy="close-pais-id"]').should("exist");
        cy.get('[data-cy="criadoPor.documento"]').should("not.have.value", "");

        // Avançar
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="endereco"]').should("exist");
      });
    });

    it("CT-SIG-CRD-004 — Dados profissionais da coordenação sem vínculo permite avançar", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-profissionais"]').click();

        cy.get('[data-cy="possui-vinculo-institucional"]').uncheck({
          force: true,
        });
        cy.get('[data-cy="next-button"]').click();

        cy.get('[data-cy="apresentacao"]').should("exist");
      });
    });
  });

  // F-08 — APRESENTAÇÃO

  context("F-08 — Apresentação", () => {
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

    it.skip("CT-SIG-APR-002 — Impedir adição de membro duplicado", () => {
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
        cy.contains("Confirmar").click();

        cy.get(".css-1osde9l").click();
        cy.get("#autocomplete-1-listbox-option-1").click();
        cy.get(".css-3xh3ky").click();
        cy.contains("Sim, continuar").click();

        cy.contains("já existe", { matchCase: false }).should("exist");
      });
    });

    it("CT-SIG-APR-003 — Remover um membro da proposta", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();

        cy.contains(dados.membro.nome)
          .parent()
          .find(
            'button[aria-label="Excluir"], .fa-trash, [data-cy="remover-membro"]',
          )
          .first()
          .click();

        cy.contains("Sim", { matchCase: false }).click();

        cy.contains(dados.membro.nome).should("not.exist");
      });
    });

    it("CT-SIG-APR-004 — Busca por membro inexistente", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        cy.contains(dados.proposta.titulo)
          .parent()
          .contains("Em Edição")
          .click();
        cy.contains("Apresentação").click();
        cy.get('[data-cy="membros"]').click();

        cy.get(".css-1osde9l").type("UsuarioFantasma123{enter}");

        cy.contains("Nenhum", { matchCase: false }).should("exist");
      });
    });
  });

  // F-09 - ANEXOS

  context("F-09 — Anexos", () => {
    it("CT-SIG-ANX-002 — Arquivo acima do limite é bloqueado", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="anexos"]').click();
        cy.get('[data-cy="documentos-da-proposta"]').click();

        cy.get('[data-cy="open-select-categories-documento"]').click();
        cy.get('[data-cy="carta-de-apresentacao"]').click();

        cy.get('[data-cy="documentoPropostaAnexo-upload"]').selectFile(
          "cypress/fixtures/documento_grande.pdf",
          { force: true },
        );

        cy.contains("documento_grande.pdf").should("not.exist");
      });
    });

    it("CT-SIG-ANX-003 — Formato inválido é rejeitado", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="anexos"]').click();
        cy.get('[data-cy="documentos-da-proposta"]').click();

        cy.get('[data-cy="open-select-categories-documento"]').click();
        cy.get('[data-cy="carta-de-apresentacao"]').click();

        cy.get('[data-cy="documentoPropostaAnexo-upload"]').selectFile(
          "cypress/fixtures/imagem_teste.jpg",
          { force: true },
        );

        cy.contains("imagem_teste.jpg").should("not.exist");
      });
    });

    it("CT-SIG-ANX-004 — Documento obrigatório ausente bloqueia avanço", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="anexos"]').click();
        cy.get('[data-cy="documentos-da-proposta"]').click();

        // Não faz upload de nada
        cy.get('[data-cy="next-button"]').click();

        // Sistema deve bloquear
        cy.get('[data-cy="documentos-da-proposta"]').should("exist");
      });
    });
  });

  // F-10 — TERMO E SUBMISSÃO

  context("F-10 — Termo e Submissão", () => {
    it.skip("CT-SIG-SUB-001 — Submeter proposta completa (a implementar)", () => {});

    it("CT-SIG-SUB-002 — Botão Submeter desabilitado sem Termo de Aceite", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="finalizacao"]').click();
        cy.get('[data-cy="termo-de-aceite"]').click();

        // Confirma checkbox desmarcado
        cy.get('[data-cy="termo-de-aceite-aceito"]').uncheck({ force: true });

        // Botão de submeter deve estar desabilitado
        cy.get('[data-cy="next-button"]').should("be.disabled");
      });
    });
  });

  // F-11 - NAVEGAÇÃO

  context("F-11 — Navegação", () => {
    it("CT-SIG-NAV-001 — Botão Anterior desabilitado no primeiro substep", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-pessoais"]').click();

        cy.get('[data-cy="prev-button"]').should("be.disabled");
      });
    });

    it("CT-SIG-NAV-002 — Botão Voltar fecha assistente e retorna ao edital", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="breadcrumb-voltar"]').click();

        cy.contains("2026-0001 Sig Cypress").should("exist");
      });
    });

    it("CT-SIG-NAV-003 — Navegação pelo menu lateral preserva dados", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        // Navega para Coordenação e volta para Caracterização pelo menu
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="caracterizacao"]').click();

        // Dados de título devem estar preservados
        cy.get('[data-cy="titulo"]').should(
          "have.value",
          dados.proposta.titulo,
        );
      });
    });

    it("CT-SIG-PER-002 — Rascunho de proposta acessível após abandono", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Vai pra home e volta pra proposta via minhas propostas
        cy.get('[data-cy="breadcrumb-home"]').click();
        navegarParaProposta(dados);

        // Dados devem estar preservados
        cy.get('[data-cy="titulo"]').should(
          "have.value",
          dados.proposta.titulo,
        );
      });
    });
  });

  // F-12 — VERIFICAÇÃO DE PENDÊNCIAS

  context("F-12 — Verificação de Pendências", () => {
    it("CT-SIG-PND-002 — Bloqueia submissão com pendências", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        cy.get('[data-cy="finalizacao"]').click();
        cy.get('[data-cy="menu-verificar-pendencias"]').click();

        // Verificar que sistema exibe pendências e bloqueia
        cy.contains("pendências").should("exist");
      });
    });

    it("CT-SIG-PND-001 — Nova proposta com pulo de etapas exibe pendências", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        navegarParaProposta(dados);

        // Pula direto para finalização pelo menu lateral
        cy.get('[data-cy="finalizacao"]').click();
        cy.get('[data-cy="menu-verificar-pendencias"]').click();

        cy.contains("pendências").should("exist");
      });
    });
  });
  // F-13 — CICLO DE VIDA DOS CONVITES DE MEMBROS
  context("F-13 — Ciclo de Vida dos Convites de Membros", () => {
    it.skip("CT-SIG-MBR-001 — Reenvio de convite após recusa", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // 1. Usa a função base que vocês já criaram e que funciona perfeitamente!
        navegarParaProposta(dados);

        // 2. Acessar substep "Membros" da Apresentação
        cy.contains("Apresentação").click();
        cy.get('[data-cy="membros"]').click();

        // 3. Localizar membro com status "Recusado" e verificar o botão
        cy.contains("Recusado", { matchCase: false })
          .parents("tr") // ou 'div' se a tabela usar formato de cards
          .as("linhaDoMembroRecusado");

        cy.get("@linhaDoMembroRecusado").within(() => {
          // Clica no botão de reenviar (ajuste o ícone ou data-cy se necessário)
          cy.get('button[aria-label="Reenviar Convite"], .fa-paper-plane', {
            timeout: 4000,
          })
            .should("be.visible")
            .click();
        });

        // 4 e 5. Validar mudança de status e do botão
        cy.get("@linhaDoMembroRecusado").within(() => {
          cy.contains("Pendente", { matchCase: false }).should("exist");
          cy.get(
            'button[aria-label="Excluir"], .fa-trash, [data-cy="remover-membro"]',
          ).should("exist");
          cy.contains("Recusado", { matchCase: false }).should("not.exist");
        });
      });
    });
  });
});
