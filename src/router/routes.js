const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'sobre', component: () => import('pages/SobrePage.vue') },
      { path: 'contacto', component: () => import('pages/ContactoPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registar', component: () => import('pages/RegistarPage.vue') },
      { path: 'recuperar-senha', component: () => import('pages/RecuperarSenhaPage.vue') },
      { 
        path: 'pagamentos', 
        component: () => import('pages/PagamentosPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/dashboard/escola',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, role: 'escola' },
    children: [
      { path: '', component: () => import('pages/dashboard/escola/EscolaDashboard.vue') },
      { path: 'matriculas', component: () => import('pages/dashboard/escola/MatriculasPage.vue') },
      { path: 'configuracoes', component: () => import('pages/dashboard/escola/ConfiguracoesPage.vue') },
      { path: 'pagamentos', component: () => import('pages/dashboard/escola/PagamentosEscolaPage.vue') },
      { path: 'professores', component: () => import('pages/dashboard/escola/ProfessoresPage.vue') },
      { path: 'alunos', component: () => import('pages/dashboard/escola/AlunosPage.vue') },
      { path: 'turmas', component: () => import('pages/dashboard/escola/TurmasPage.vue') },
      { path: 'notas', component: () => import('pages/dashboard/escola/NotasPage.vue') },
      { path: 'lista-alunos', component: () => import('pages/dashboard/escola/ListaAlunosPage.vue') }
    ]
  }
  // ... outras rotas permanecem iguais
]

export default routes