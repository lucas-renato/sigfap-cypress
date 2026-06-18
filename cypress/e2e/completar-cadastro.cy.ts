import { toCyString } from "../helpers/kebab.helper";

describe("Completar Cadastro do Usuário", () => {


    // Garante que o usuário está sempre logado antes de cada teste

    beforeEach(() => {
        cy.fixture("completar-cadastro").then((dados) => {
            cy.typeLogin(dados.email, dados.senha);

        });
    });

    // F-01 — ENDEREÇO

    context("F-01 — Endereço", () => {
        it("CT-SIG-END-001 — Preencher endereço com CEP válido (caminho feliz)", () => {
            cy.fixture("completar-cadastro").then((dados) => {

                // Passo 1: Navegar até o step Endereço
                cy.get('[data-cy="user-menu"]').click();
                cy.contains("Perfil").click();
                cy.get('[data-cy="endereco"]').click();

                // Passo 2-4: Digitar CEP e aguardar preenchimento automático
                cy.get('[data-cy="endereco.cep"]').clear().type(dados.endereco.cep).blur();

                cy.get('[data-cy="endereco.logradouro"]', { timeout: 10000 })
                    .should("not.have.value", "");

                // Passo 5-6: Preencher Número e Complemento
                cy.get('[data-cy="endereco.numero"]').clear().type(dados.endereco.numero);
                cy.get('[data-cy="endereco.complemento"]').clear().type(dados.endereco.complemento);

                // Passo 7: Clicar em Próximo e verificar redirecionamento
                cy.get('[data-cy="next-button"]').click();
                cy.get('[data-cy="dados-academicos"]').should("exist");
            });
        });
    });


    // F-02 — DADOS ACADÊMICOS

    context("F-02 — Dados Acadêmicos", () => {
        it("CT-SIG-ACD-001 — Preencher dados acadêmicos (caminho feliz)", () => {
            cy.fixture("completar-cadastro").then((dados) => {
                // Passo 1: Navegar até o step Dados Acadêmicos
                cy.get('[data-cy="user-menu"]').click();
                cy.contains("Perfil").click();
                cy.get('[data-cy="dados-academicos"]').click();

                // Passo 2: Selecionar Instituição
                cy.get('[data-cy="open-instituicao-id"]').click();
                cy.get(`[data-cy="${dados.dadosAcademicos.instituicaoId}"]`).click();

                // Passo 3: Selecionar Unidade
                cy.get('[data-cy="open-unidade-id"]').click();
                cy.get(`[data-cy="${dados.dadosAcademicos.unidadeId}"]`).click();

                // Passo 4: Selecionar Nível Acadêmico
                cy.get('[data-cy="open-nivel-academico-id"]').click();
                cy.get(`[data-cy="${dados.dadosAcademicos.nivelAcademicoId}"]`).click();

                // Passo 5-6: Adicionar Área de Conhecimento e selecionar Grande Área
                cy.get('[data-cy="add-areas-de-conhecimento"]').click();
                cy.get('[data-cy="open-grande-area-id"]').click();
                cy.get(`[data-cy="${dados.dadosAcademicos.grandeAreaId}"]`).click();
                cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();

                // Passo 7: Preencher Currículo Lattes
                cy.get('[data-cy="lattes"]').clear().type(dados.dadosAcademicos.curriculoLattes);

                // Passo 8: Clicar em Próximo e verificar redirecionamento
                cy.get('[data-cy="next-button"]').click();
                cy.get('[data-cy="possui-vinculo-institucional"]').should("exist");
            });
        });
    });

    // F-03 — DADOS PROFISSIONAIS

    context("F-03 — Dados Profissionais", () => {
        it("CT-SIG-PROF-001 — Avançar sem vínculo institucional", () => {
            // Passo 1: Navegar até o step Dados Profissionais
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="dados-profissionais"]').click();

            // Passo 2-3: Garantir que checkbox está desmarcado
            // Se já estiver marcado do cadastro anterior, desmarca antes de testar
            cy.get('[data-cy="possui-vinculo-institucional"]').uncheck({ force: true });
            cy.get('[data-cy="possui-vinculo-institucional"]').should("not.be.checked");

            // Passo 4: Clicar em Próximo e verificar redirecionamento
            cy.get('[data-cy="next-button"]').click();
            cy.get('[data-cy="usuarioAnexo-upload"]').should("exist");
        });
    });

    // F-04 — DOCUMENTOS PESSOAIS

    context("F-04 — Documentos Pessoais", () => {
        it("CT-SIG-DOC-001 — Upload de documento válido (PDF)", () => {
            // Passo 1: Navegar até o step Documentos Pessoais
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="documentos-pessoais"]').click();

            // Passo 2-3: Verificar que upload está desabilitado e selecionar tipo de documento
            cy.get('[data-cy="usuarioAnexo-upload"]').should("be.disabled");
            cy.get('[data-cy="open-select-categories-usuario-a"]').click();
            cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

            // Passo 4: Verificar que upload foi habilitado e realizar o upload
            cy.get('[data-cy="usuarioAnexo-upload"]').should("not.be.disabled");
            cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                "cypress/fixtures/documento_teste.pdf",
                { force: true }
            );

            // Passo 5: Finalizar cadastro e verificar sucesso
            cy.get('[data-cy="menu-finalizar"]').click();
            cy.get('[data-cy="dados-pessoais"]').should("exist");
        });
    });

});