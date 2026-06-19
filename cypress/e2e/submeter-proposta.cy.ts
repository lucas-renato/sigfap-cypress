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
        cy.get('[data-cy="filters.protocolo"]', { timeout: 10000 })
            .type(dados.proposta.protocolo);
        cy.contains("Aplicar Filtros").click();
        cy.contains(dados.proposta.protocolo, { timeout: 10000 }).should("exist");
        cy.contains(dados.proposta.titulo)
            .parent().parent().parent()
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
                cy.get('[data-cy="filters.protocolo"]', { timeout: 10000 })
                    .type(dados.proposta.protocolo);
                cy.contains("Aplicar Filtros").click();
                cy.contains(dados.proposta.protocolo, { timeout: 10000 }).should("exist");
                cy.contains(dados.proposta.titulo)
                    .parent().parent().parent()
                    .find("button")
                    .eq(1)
                    .click();

                // Preencher Informações Iniciais
                cy.get('[data-cy="titulo"]', { timeout: 10000 }).clear().type(dados.proposta.titulo);
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
        it.skip("CT-SIG-INF-001 — Pergunta obrigatória não respondida (a implementar)", () => {
        });

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
                cy.get('[data-cy="criadoPor.dataNascimento"]').should("not.have.value", "");
                cy.get('[data-cy="close-pais-id"]').should("exist");
                cy.get('[data-cy="criadoPor.documento"]').should("not.have.value", "");

                // Avançar
                cy.get('[data-cy="next-button"]').click();
                cy.get('[data-cy="endereco"]').should("exist");
            });
        });
    });


    // F-08 — APRESENTAÇÃO

    context("F-08 — Apresentação", () => {
        it.skip("CT-SIG-APR-001 — Adicionar membro com status Pendente (requer segundo usuário cadastrado)", () => { });

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
    });


    // F-10 — TERMO E SUBMISSÃO

    context("F-10 — Termo e Submissão", () => {
        it.skip("CT-SIG-SUB-001 — Submeter proposta completa (a implementar)", () => {

        });
    });

});