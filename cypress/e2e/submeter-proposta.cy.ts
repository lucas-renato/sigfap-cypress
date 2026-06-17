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
                cy.visit("/edital/33/minhas-propostas/959")

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
        it.skip("CT-SIG-INF-001 — Pergunta obrigatória não respondida (a implementar)", () => {
        });

        it("CT-SIG-ABR-001 — Abrangência opcional (avançar sem preencher)", () => {
            cy.fixture("submeter-proposta").then((dados) => {

                cy.visit("/edital/33/minhas-propostas/959")
        

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
                cy.visit("/edital/33/minhas-propostas/959")
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

    context("F-08 — Apresentação", () => {
        it.skip("CT-SIG-APR-001 — Adicionar membro com status Pendente (requer segundo usuário cadastrado)", () => { });

    });

    // F-12 — VERIFICAÇÃO DE PENDÊNCIAS

    context("F-12 — Verificação de Pendências", () => {
        it("CT-SIG-PND-001 — Bloqueia submissão com pendências", () => {
            cy.fixture("submeter-proposta").then((dados) => {
                cy.visit("/edital/33/minhas-propostas/959")

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