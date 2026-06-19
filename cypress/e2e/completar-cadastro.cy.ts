describe("Completar Cadastro do Usuário", () => {


    // Garante que o usuário está sempre logado antes de cada teste

    beforeEach(() => {
        cy.fixture("completar-cadastro").then((dados) => {
            cy.typeLogin(dados.email, dados.senha);

        });
    });

    function limparDocumentoPessoal() {
        cy.get('[data-cy="user-menu"]').click();
        cy.contains("Perfil").click();
        cy.get('[data-cy="documentos-pessoais"]').click();

        cy.get("body").then(($body) => {
            if (!$body.text().includes("Nenhum arquivo adicionado")) {
                cy.contains("Arquivos anexados")
                    .next("div")
                    .as("cardDoArquivo");

                cy.get("@cardDoArquivo")
                    .find("button, svg, [class*='icon']")
                    .first()
                    .click({ force: true });

                cy.get("@cardDoArquivo").should("not.exist");
            }
        });
    }

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

    //Exceções

    context("F-01 — Endereço (CEP inválido)", () => {
        it("CT-SIG-END-003 — CEP inválido não preenche campos automaticamente", () => {
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="endereco"]').click();

            // Salva o valor atual do logradouro
            cy.get('[data-cy="endereco.logradouro"]').invoke("val").as("logradouroAntes");


            cy.get('[data-cy="endereco.cep"]').clear().type("99999-999").blur();

            // Campo logradouro deve permanecer vazio — CEP não existe
            cy.get("@logradouroAntes").then((valorAntes) => {
                cy.get('[data-cy="endereco.logradouro"]').should("have.value", valorAntes);
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
        it("CT-SIG-ACD-002 — Sugerir instituição exibe campos de nome e sigla", () => {
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="dados-academicos"]').click();

            // Marca checkbox "Não encontrei minha instituição"
            cy.get('[data-cy="sugerir-instituicao"]').check({ force: true });

            // Verifica que campos de nome e sigla aparecem
            cy.get('[data-cy="instituicaoNome"]').should("exist");
            cy.get('[data-cy="instituicaoSigla"]').should("exist");

            // Preenche os campos
            cy.get('[data-cy="instituicaoNome"]').type("Instituto Teste");
            cy.get('[data-cy="instituicaoSigla"]').type("IT");

            // Verifica que os campos aparecem
            cy.get('[data-cy="instituicaoNome"]').should("have.value", "Instituto Teste");
            cy.get('[data-cy="instituicaoSigla"]').should("have.value", "IT");
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

    //Exceções

    context("F-03 — Dados Profissionais (com vínculo)", () => {
        it("CT-SIG-PROF-002 — Marcar vínculo exibe campos adicionais", () => {
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="dados-profissionais"]').click();

            // Marca o checkbox de vínculo institucional
            cy.get('[data-cy="possui-vinculo-institucional"]').check({ force: true });
            cy.get('[data-cy="possui-vinculo-institucional"]').should("be.checked");

            // Verifica que campos adicionais aparecem
            cy.get('[data-cy="open-tipo-vinculo-institucional"]').should("exist");
            cy.get('[data-cy="possui-vinculo-empregaticio"]').should("exist");
        });
    });

    context("F-03 — Dados Profissionais (desmarcar vínculo)", () => {
        it("CT-SIG-PROF-003 — Desmarcar vínculo oculta campos adicionais", () => {
            cy.get('[data-cy="user-menu"]').click();
            cy.contains("Perfil").click();
            cy.get('[data-cy="dados-profissionais"]').click();

            // Garante que está marcado primeiro
            cy.get('[data-cy="possui-vinculo-institucional"]').check({ force: true });
            cy.get('[data-cy="open-tipo-vinculo-institucional"]').should("exist");

            // Desmarca e verifica que campos somem
            cy.get('[data-cy="possui-vinculo-institucional"]').uncheck({ force: true });
            cy.get('[data-cy="open-tipo-vinculo-institucional"]').should("not.exist");
        });
    });


    // F-04 — DOCUMENTOS PESSOAIS

    context("F-04 — Documentos Pessoais", () => {
        it("CT-SIG-DOC-001 — Upload de documento válido (PDF)", () => {
            
            limparDocumentoPessoal();
            
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

        it("CT-SIG-DOC-002 — Arquivo acima de 3MB é bloqueado", () => {
            limparDocumentoPessoal();
            

            cy.get('[data-cy="open-select-categories-usuario-a"]').click();
            cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

            cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                "cypress/fixtures/documento_grande.pdf",
                { force: true }
            );

            // Arquivo não deve aparecer na listagem
            cy.contains("documento_grande.pdf").should("not.exist");
        });

        it("CT-SIG-DOC-003 — Formato inválido (.jpg) é rejeitado", () => {
            limparDocumentoPessoal();

            cy.get('[data-cy="open-select-categories-usuario-a"]').click();
            cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

            cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                "cypress/fixtures/imagem_teste.jpg",
                { force: true }
            );

            // Arquivo não deve aparecer na listagem
            cy.contains("imagem_teste.jpg").should("not.exist");
        });

        it("CT-SIG-DOC-004 — Arquivo de exatamente 3MB é aceito", () => {
            limparDocumentoPessoal();

            cy.get('[data-cy="open-select-categories-usuario-a"]').click();
            cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

            cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                "cypress/fixtures/documento_limite.pdf",
                { force: true }
            );

            // Arquivo deve aparecer na listagem
            cy.contains("documento_limite.pdf").should("exist");
        });
    });

});

