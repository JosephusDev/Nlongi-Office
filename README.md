# Documento de Planejamento para o App Longi

## **Objetivo**
Criar um aplicativo local e offline que facilite a gestão de turmas, alunos, notas, pautas, estatísticas de desempenho e outras funcionalidades relacionadas. Este aplicativo será voltado para professores e utilizará o banco de dados SQLite para armazenamento dos dados.

---

## **Requisitos Funcionais**

1. **Autenticação e Autorização**
   - Criar conta (nome, gênero, login, senha).
   - Fazer Login com credênciais ou Biometria.

2. **Gestão de Disciplinas:**
   - Criar, editar e excluir disciplinas.
   - Associar disciplinas às turmas.

3. **Gestão de Turmas:**
   - Criar, editar e excluir turmas.
   - Associar alunos às turmas.
   
4. **Gestão de Alunos:**
   - Adicionar, editar e excluir informações dos alunos (nome).
   - Visualizar perfil completo de um aluno.

5. **Gestão de Notas e Pautas:**
   - Registrar notas por disciplina.
   - Gerar e visualizar pautas.
   - Exportar relatórios de notas em formatos como PDF ou Excel.

6. **Estatísticas e Relatórios:**
   - Exibir gráficos ou tabelas de desempenho por turma e aluno.
   - Gerar relatórios com análises simples (média da turma, alunos abaixo da média, etc.).

7. **Controle de Frequência:**
   - Registrar e visualizar a frequência dos alunos.
   - Gerar relatórios de presença e faltas.

8. **Funcionalidades Extras:**
   - Sistema de busca para localizar alunos, turmas ou disciplinas rapidamente.
   - Backup e restauração de dados localmente.
   - Suporte a temas claros e escuros.

---

## **Requisitos Não Funcionais**

1. **Performance:** O aplicativo deve ser rápido e responsivo, mesmo com grandes volumes de dados.
2. **Segurança:**
   - Os dados devem ser armazenados localmente em SQLite com criptografia básica.
   - Implementação de autenticação local para acesso ao aplicativo.
3. **Usabilidade:**
   - Interface simples e intuitiva, adequada ao uso de professores.
   - Navegação fluida entre as funcionalidades.
4. **Compatibilidade:**
   - Disponível para Android e IOS.
5. **Offline:**
   - Todas as funcionalidades devem funcionar sem necessidade de conexão à internet.

---

## **Estórias do Usuário**

1. **Como professor**, quero criar e organizar minhas turmas para poder acompanhar melhor os alunos.
2. **Como professor**, quero registrar notas e frequências para ter controle sobre o desempenho e a assiduidade dos alunos.
3. **Como professor**, quero visualizar relatórios e gráficos de desempenho para identificar padrões ou alunos que precisam de mais suporte.
4. **Como professor**, quero fazer backup e restaurar meus dados para garantir que nada seja perdido.
5. **Como professor**, quero um aplicativo simples e intuitivo que funcione offline para que eu possa usá-lo em qualquer lugar.

---

## **Etapas de Desenvolvimento**

### **Planejamento Inicial**
- [x] Definir a arquitetura do aplicativo.
- [x] Escolher ferramentas de desenvolvimento e bibliotecas necessárias (ex.: framework de interface gráfica, SQLite, etc.).

### **Banco de Dados (SQLite)**
- [x] Modelar banco de dados com tabelas para turmas, alunos, notas, frequência e configurações.
- [x] Criar scripts de inicialização do banco de dados.

### **Interface de Usuário (UI/UX)**
- [ ] Desenhar wireframes e protótipos para as telas principais (ex.: dashboard, cadastro de alunos, etc.).
- [x] Implementar tela inicial com menu de navegação.
- [ ] Criar telas para:
  - [ ] Gestão de turmas.
  - [ ] Gestão de disciplinas.
  - [ ] Gestão de alunos.
  - [ ] Registro de notas e frequência.
  - [ ] Visualização de relatórios e estatísticas.

### **Funcionalidades Principais**
- [ ] Implementar CRUD (Create, Read, Update, Delete) para turmas.
- [ ] Implementar CRUD para disciplinas.
- [ ] Implementar CRUD para alunos.
- [ ] Implementar registro e cálculo de notas.
- [ ] Implementar controle de frequência.
- [ ] Gerar relatórios e exportações (PDF, EXCEL).

### **Funcionalidades Secundárias**
- [ ] Implementar sistema de busca.
- [ ] Adicionar suporte a temas claros e escuros.
- [ ] Criar funcionalidade de backup e sincronozação.

### **Testes**
- [ ] Realizar testes unitários para garantir que as funcionalidades básicas funcionem corretamente.
- [ ] Realizar testes de usabilidade com professores.

### **Finalização**
- [ ] Documentar o uso do aplicativo (manual para professores).
- [ ] Realizar testes finais e correções.

---