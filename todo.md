# MonitorHub - TODO List

## Banco de Dados
- [x] Criar tabela de clientes (pessoas jurídicas e físicas)
- [x] Criar tabela de processos fiscais
- [x] Criar tabela de declarações
- [x] Criar tabela de certificados digitais
- [x] Criar tabela de procurações
- [x] Criar tabela de notificações
- [x] Criar tabela de mensagens e-CAC
- [x] Criar tabela de relatórios fiscais
- [x] Criar tabela de parametrizações
- [x] Criar tabela de agendamentos
- [x] Executar migrations SQL

## Backend API
- [x] Implementar CRUD de clientes
- [x] Implementar busca e filtros de clientes
- [x] Implementar gestão de processos fiscais
- [x] Implementar gestão de declarações
- [x] Implementar gestão de certificados digitais
- [x] Implementar gestão de procurações
- [x] Implementar sistema de notificações
- [x] Implementar gestão de mensagens e-CAC
- [x] Implementar relatórios fiscais
- [x] Implementar parametrizações
- [x] Implementar agendamentos
- [ ] Implementar exportação de planilhas

## Frontend - Layout e Navegação
- [x] Configurar tema escuro profissional
- [x] Criar DashboardLayout com sidebar
- [x] Implementar navegação principal
- [x] Criar página Home/Dashboard Geral
- [x] Criar página MonitorHub Dashboard
- [x] Criar página de Clientes
- [x] Criar página de Configurações
- [x] Implementar sistema de autenticação visual

## Frontend - Dashboard Geral
- [x] Cards de status de processos
- [x] Seção de pendências fiscais
- [x] Seção de sublimites do Simples
- [x] Seção de clientes
- [x] Seção de certificados digitais
- [x] Seção de parametrizações
- [x] Seção de agendamentos
- [x] Última atualização

## Frontend - MonitorHub
- [x] Dashboard com bem-vindo e última atualização
- [x] Seção de pendências fiscais (geral e por processo)
- [x] Seção de sublimites do Simples (RBT12)
- [x] Seção de mensagens e-CAC
- [x] Seção de notificações com busca
- [x] Seção de ausência de declarações
- [x] Seção de relatórios fiscais
- [x] Seção de declarações por processo
- [x] Abas para cada processo fiscal

## Frontend - Processos Fiscais
- [ ] Página Simples Nacional | MEI (PGDAS/PGMEI)
- [ ] Página DCTFWeb
- [ ] Página FGTS Digital
- [ ] Página Parcelamentos
- [ ] Página Situação Fiscal
- [ ] Página Caixas Postais
- [ ] Página Declarações
- [ ] Tabelas com filtros avançados
- [ ] Exportação de dados

## Frontend - Clientes
- [x] Página de listagem de clientes
- [x] Cards de status de certificados
- [x] Modal de adicionar cliente (PJ/PF)
- [x] Formulário de cadastro completo
- [x] Filtros por certificado, procuração, regime
- [x] Busca por nome, CNPJ, CPF, ID
- [ ] Exportação de planilha
- [ ] Adicionar múltiplos clientes

## Frontend - Certificados Digitais
- [x] Monitoramento de status
- [x] Alertas de vencimento
- [x] Integração com clientes

## Frontend - Procurações
- [x] Gestão de procurações
- [x] Associação com clientes

## Frontend - Parametrizações
- [x] Configuração de número de disparo
- [x] Configuração de e-mail de disparo
- [x] Configuração de certificado digital

## Frontend - Agendamentos
- [x] Configuração de datas de agendamento
- [x] DAS-Simples, DAS-MEI, Parcelamentos, DCTFWeb, Declarações

## Testes
- [x] Testes unitários backend
- [x] Testes de integração
- [x] Validação de formulários

## Finalização
- [ ] Criar checkpoint final
- [ ] Documentação de uso


## Integração com APIs da Receita Federal
- [ ] Pesquisar APIs disponíveis (e-CAC, Simples Nacional, DCTFWeb, FGTS Digital)
- [ ] Documentar endpoints e autenticação necessária
- [ ] Implementar serviço de integração com e-CAC
- [ ] Implementar serviço de integração com Simples Nacional (PGDAS/PGMEI)
- [ ] Implementar serviço de integração com DCTFWeb
- [ ] Implementar serviço de integração com FGTS Digital
- [ ] Criar endpoints backend para sincronização de dados
- [ ] Implementar sistema de cache e rate limiting
- [ ] Adicionar interface frontend para sincronização manual
- [ ] Implementar sincronização automática agendada
- [ ] Criar testes de integração
- [ ] Documentar processo de configuração de credenciais
